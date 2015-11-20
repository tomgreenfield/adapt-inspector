# Inspector

An extension to inspect details of elements.

## Installation

* Add the following to `config.json`:
```json
"_inspector": {
	"_isEnabled": true,
	"_tracUrl": "",
	"_sendTo": ""
}
```
* Toggle `_isEnabled` to turn Inspector on or off.
* Populate `_tracUrl` to make element IDs clickable to a specific Trac.
* Populate `_sendTo` to get details  sent to "console" or "clipboard" when `_tracUrl` is not populated.
* With [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run `adapt install inspector`. Alternatively, download the ZIP and extract into the src > extensions directory.
* Run an appropriate Grunt task.

## Usage

* Elements are annotated on hover with their types and IDs.
* Click the element IDs to create tickets on Trac or when `_tracUrl` is empty and `_sendTo` has correct value to send details to console or clipboard.
* Roll over the IDs for tooltips containing additional details.
