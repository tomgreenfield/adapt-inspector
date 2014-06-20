# adapt-inspector

An extension to inspect details of elements on a page. Reviewers may click the element IDs to create tickets on Trac.

## Installation

* Add the following JSON to `config.json`:
```json
"_inspector": {
	"_isEnabled": true,
	"_tracUrl": ""
}
```

* Toggle `_isEnabled` to turn Inspector on or off.
* Populate `_tracUrl` to make element IDs clickable to a specific Trac.