# Inspector

An extension to inspect details of elements.

## Installation

* Add the following to `config.json`:
```json
"_inspector": {
	"_isEnabled": true,
	"_disableOnTouch": true,
	"_tracUrl": "",
	"tracSummaryPrompt": ""
}
```
* Optionally, populate `_tracUrl` to make Inspector link to a specific [Trac](https://trac.edgewall.org) and, if required, add a summary prompt to `tracSummaryPrompt` - if you don't prompt the user to enter a summary you might find you end up with a long list of component/page ids in your Trac ticket report - which isn't that helpful!
* With [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run `adapt install inspector`. Alternatively, download the ZIP and extract into the src > extensions directory.
* Run an appropriate Grunt task.

## Usage

* Elements are annotated on visit with their types and IDs.
* Select the element IDs to create tickets on Trac.
* Hover over the IDs for tooltips containing additional details.

## Attributes

Attribute | Type | Description | Default
--------- | ---- | ----------- | -------
`_isEnabled` | Boolean | Enables Inspector globally | `false`
`_disableOnTouch` | Boolean | Disables Inspector on touch devices | `false`
`_tracUrl` | String | The Trac URL which Inspector should link to e.g. `"https://trac.edgewall.org/demo-1.0"` | `""`
`tracSummaryPrompt` | String | Prompt text you'd like to be added to the Trac ticket summary e.g. `"Please enter a summary of the issue here"` | `""`
`_elementsToInspect` | Array | The rendered views which should be inspectable | `[ "menu", "page", "article", "block", "component" ]`

* Note: all attributes are optional.