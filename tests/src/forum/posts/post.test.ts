import test from "tape";

import { runScenario, pause, CallableCell } from '@holochain/tryorama';
import { NewEntryAction, ActionHash, Record, AppBundleSource } from '@holochain/client';

test('create Post', async t => {
  await runScenario(async scenario => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/../workdir/forum.happ';

    // Set up the app to be installed 
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithApps([appSource, appSource]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Alice creates a Post
    try {
      const post_ah: ActionHash = await alice.cells[0].callZome({
        zome_name: "posts",
        fn_name: "create_post",
        payload: {
          title: 'my post',
          content: 'this is a post'
        }
      });

      console.log('post is ', post_ah);
      t.ok(post_ah);
    } catch(e) {
      t.fail(e.data.data);
    }
  });
});
