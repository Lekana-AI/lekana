import { getFewShotHistory } from '../utils/ai.utils';
import * as fs from 'fs';
import * as path from 'path';

async function verifyHistory() {
    console.log('--- Verification Started ---');

    // 1. Load active actions
    const actionsPath = path.join(__dirname, '../../actions_output_utf8.json');
    if (!fs.existsSync(actionsPath)) {
        console.error('actions_output_utf8.json not found!');
        process.exit(1);
    }
    const actions = JSON.parse(fs.readFileSync(actionsPath, 'utf8'));
    const actionNames = new Set(actions.map((a: any) => a.name));

    // 2. Get history
    const history = getFewShotHistory(actions);

    let errors = 0;

    for (const turn of history) {
        if (turn.role === 'model') {
            const text = turn.parts[0].text;
            const jsonStart = text.indexOf('---JSON_START---');
            const jsonEnd = text.indexOf('---JSON_END---');

            if (jsonStart === -1 || jsonEnd === -1) {
                console.error('❌ Missing JSON markers in model turn text');
                errors++;
                continue;
            }

            const jsonStr = text.slice(jsonStart + '---JSON_START---'.length, jsonEnd).trim();
            try {
                const workflow = JSON.parse(jsonStr);
                console.log(`✅ Valid JSON in workflow: "${workflow.name}"`);

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
                const nodeIds = new Set(workflow.nodes.map((n: any) => n.tempId));
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
                console.error('❌ Failed to parse JSON in model turn');
                errors++;
            }
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
