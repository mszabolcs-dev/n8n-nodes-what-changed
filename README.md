# n8n-nodes-what-changed

This is an n8n community node. Which is created to detect changes between executions.
A new node called _What Changed_ will be added to your toolset.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Compatibility](#compatibility)
[Usage](#usage)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## To-do

- [ ] Field comparison

## Compatibility

_State the minimum n8n version, as well as which versions you test against. You can also include any known version incompatibility issues._

## Usage

It's easy to use, just connect the input you want, the node will check if anything is changed since last execution and output the data to the proper true/false branch.
Also you can set a field to only check for that when comparing datasets.
**This node only works if the workflow is active and executed through regular triggers. Test workflow won't work properly!**

## Version history

- 0.1.0 - Initial setup - testing if everything is working alright
