import test from "tape";

import { runScenario, pause, CallableCell } from '@holochain/tryorama';
import { NewEntryAction, ActionHash, Record, AppBundleSource } from '@holochain/client';

test('clone cells', async t => {
  await runScenario(async scenario => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/../workdir/forum.happ';

    // Set up the app to be installed 
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithApps([appSource, appSource]);
    const aliceAppAgent = alice.conductor.appAgentWs();

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Alice clones the cell with a name
    try {
      const cloneCell1 = await aliceAppAgent.createCloneCell({
        role_name: 'forum',
        modifiers: {
          network_seed: '1234'
        }
      });
      
      const cloneCell2 = await aliceAppAgent.createCloneCell({
        role_name: 'forum',
        name: 'named cell A',
        modifiers: {
          network_seed: '1234'
        }
      });

      const cloneCell3 = await aliceAppAgent.createCloneCell({
        role_name: 'forum',
        name: 'named cell B',
        modifiers: {
          network_seed: '1234'
        }
      });
      
      t.deepEqual(cloneCell1.original_dna_hash, cloneCell2.original_dna_hash);
      t.deepEqual(cloneCell2.original_dna_hash, cloneCell3.original_dna_hash);

      t.deepEqual(cloneCell1.cell_id[0], cloneCell2.cell_id[0], "Named cell should have same DNA hash as otherwise identical unnamed cell");
      t.deepEqual(cloneCell2.cell_id[0], cloneCell3.cell_id[0], "Named cells with different names but otherwise identical should have same DNA hashes");
    } catch(e) {
      t.fail(e.data.data);
    }
  });
});
