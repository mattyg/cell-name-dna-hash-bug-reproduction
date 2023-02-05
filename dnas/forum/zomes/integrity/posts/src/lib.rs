use hdi::prelude::*;

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Post {
    pub title: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    #[entry_def(visibility = "private")]
    Post(Post),
}

#[hdk_extern]
pub fn genesis_self_check(
    _data: GenesisSelfCheckData,
) -> ExternResult<ValidateCallbackResult> {
    Ok(ValidateCallbackResult::Valid)
}

#[hdk_extern]
pub fn validate(op: Op) -> ExternResult<ValidateCallbackResult> {
    let _op_type = op.to_type::<EntryTypes, ()>()?;
    Ok(ValidateCallbackResult::Valid)
}
