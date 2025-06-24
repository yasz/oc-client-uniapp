const fs = require('fs');
const path = require('path');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

function splitXmlByDirectory() {
    try {
        // 读取原始 XML 文件
        const xmlContent = fs.readFileSync('scripts/cos.xml', 'utf8');

        // 解析 XML
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "#text",
            parseAttributeValue: false,
            trimValues: true
        });

        const result = parser.parse(xmlContent);

        // 获取所有 Contents
        const contents = result.ListBucketResult.Contents || [];
        console.log(`Total contents: ${contents.length}`);

        // 按一级目录分组
        const directoriesMap = new Map();

        contents.forEach(content => {
            const key = content.Key;

            // 跳过没有 Key 的内容
            if (!key || typeof key !== 'string') {
                console.log('Skipping content without valid Key:', JSON.stringify(content, null, 2));
                return;
            }

            // 提取一级目录
            let topLevelDir;
            if (key.includes('/')) {
                topLevelDir = key.split('/')[0];
            } else {
                // 根目录文件
                topLevelDir = 'root';
            }

            if (!directoriesMap.has(topLevelDir)) {
                directoriesMap.set(topLevelDir, []);
            }

            directoriesMap.get(topLevelDir).push(content);
        });

        console.log(`Found directories: ${Array.from(directoriesMap.keys()).join(', ')}`);

        // 创建输出目录
        const outputDir = 'scripts/split-xml';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 为每个一级目录生成独立的 XML 文件
        const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "#text",
            format: true,
            indentBy: "  ",
            suppressEmptyNode: true
        });

        directoriesMap.forEach((dirContents, dirName) => {
            // 创建新的 ListBucketResult 结构
            const newXmlStructure = {
                ListBucketResult: {
                    Name: result.ListBucketResult.Name,
                    Prefix: result.ListBucketResult.Prefix || '',
                    Marker: result.ListBucketResult.Marker || '',
                    MaxKeys: result.ListBucketResult.MaxKeys,
                    IsTruncated: 'false', // 设为 false，因为我们已经完整分离了
                    NextMarker: '',
                    Contents: dirContents
                }
            };

            // 生成 XML
            const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(newXmlStructure);

            // 保存到文件
            const fileName = `${dirName.replace(/[^a-zA-Z0-9\-_\u4e00-\u9fff]/g, '_')}.xml`;
            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, xmlOutput, 'utf8');

            console.log(`Generated: ${fileName} (${dirContents.length} items)`);
        });

        console.log(`\nAll XML files have been generated in: ${outputDir}`);

        // 生成目录统计
        const stats = Array.from(directoriesMap.entries()).map(([dir, contents]) => ({
            directory: dir,
            count: contents.length
        }));

        stats.sort((a, b) => b.count - a.count);

        console.log('\nDirectory Statistics:');
        stats.forEach(stat => {
            console.log(`  ${stat.directory}: ${stat.count} items`);
        });

    } catch (error) {
        console.error('Error processing XML:', error);
    }
}

// 检查是否安装了 fast-xml-parser
try {
    require('fast-xml-parser');
} catch (e) {
    console.error('fast-xml-parser package is required. Please install it with:');
    console.error('npm install fast-xml-parser');
    process.exit(1);
}

splitXmlByDirectory(); 