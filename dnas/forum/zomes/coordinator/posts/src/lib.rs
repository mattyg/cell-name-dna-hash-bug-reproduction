use hdk::prelude::*;
use posts_integrity::*;

#[hdk_extern]
pub fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
pub fn create_post(post: Post) -> ExternResult<ActionHash> {
    let post_hash = create_entry(&EntryTypes::Post(post.clone()))?;
    
    Ok(post_hash)
}
