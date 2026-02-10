const fs = require('fs');
const path = require('path');

// We can't easily import from TS files in raw JS without transpilation
// So I will parse the TS file using regex to extract the JSON blocks for verification
// This is a "lightweight" verification.

async function verifyHistory() {
    console.log('--- JS Verification Started ---');

    // 1. Load active actions
    const actionsPath = path.join(__dirname, '../../actions_output_utf8.json');
    if (!fs.existsSync(actionsPath)) {
        console.error('actions_output_utf8.json not found!');
        process.exit(1);
    }
    let actionsRaw = fs.readFileSync(actionsPath, 'utf8');
    // Remove BOM if present
    if (actionsRaw.charCodeAt(0) === 0xFEFF) {
        actionsRaw = actionsRaw.slice(1);
    }
    const actions = JSON.parse(actionsRaw);
    const actionNames = new Set(actions.map(a => a.name));

    // 2. Read ai.utils.ts
    const utilsPath = path.join(__dirname, '../utils/ai.utils.ts');
    const content = fs.readFileSync(utilsPath, 'utf8');

    // 3. Extract JSON blocks
    // Use a more specific regex to avoid matching the description in the system instruction
    const jsonRegex = /---JSON_START---\n([\s\S]*?)---JSON_END---/g;
    let match;
    let errors = 0;

    while ((match = jsonRegex.exec(content)) !== null) {
        const jsonStr = match[1].trim();
        try {
            const workflow = JSON.parse(jsonStr);
            console.log(`✅ Valid JSON in workflow turn: "${workflow.name}"`);

            // Verify action names
            for (const node of workflow.nodes) {
                if (!actionNames.has(node.actionName)) {
                    console.error(`❌ Action name "${node.actionName}" not found in active actions!`);
                    errors++;
                } else {
                    console.log(`  ✅ Action "${node.actionName}" exists`);
                }
            }

            // Basic edge verification
            const nodeIds = new Set(workflow.nodes.map(n => n.tempId));
            for (const edge of workflow.edges) {
                if (!nodeIds.has(edge.sourceTempId)) {
                    console.error(`❌ Edge source "${edge.sourceTempId}" not found in nodes!`);
                    errors++;
                }
                if (!nodeIds.has(edge.targetTempId)) {
                    console.error(`❌ Edge target "${edge.targetTempId}" not found in nodes!`);
                    errors++;
                }
            }

        } catch (e) {
            console.error('❌ Failed to parse JSON block in ai.utils.ts');
            console.error(e.message);
            errors++;
        }
    }

    if (errors > 0) {
        console.error(`\n--- Verification Failed with ${errors} errors ---`);
        process.exit(1);
    } else {
        console.log('\n--- Verification Passed! ---');
    }
}

verifyHistory();
