# Inspector

An extension to inspect details of elements.

## Installation

* Add the following to `config.json`:
```json
"_inspector": {
	"_isEnabled": true,
	"_disableOnTouch": true,
	"_trac": {
		"_url": "",
		"_setComponentToCourseId": true
	}
}
```
* Optionally, populate `_url` to make Inspector link to a specific [Trac](https://trac.edgewall.org).
* With [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run `adapt install inspector`. Alternatively, download the ZIP and extract into the src > extensions directory.
* Run an appropriate Grunt task.

## Usage

* Elements are annotated on visit with their types and IDs.
* Select the element IDs to create tickets on Trac.
* Hover over the IDs for tooltips containing additional details.

## Attributes
<table>
	<tr>
		<th colspan="2">Attribute<br></th>
		<th>Type</th>
		<th>Description</th>
		<th>Default</th>
	</tr>
	<tr>
		<td colspan="2"><code>_isEnabled</code></td>
		<td>Boolean</td>
		<td>Enables Inspector globally</td>
		<td><code>false</code></td>
	</tr>
	<tr>
		<td rowspan="2"><code>_trac</code></td>
		<td><code>_url</code></td>
		<td>String</td>
		<td>The Trac URL which Inspector should link to e.g. <code>"https://trac.edgewall.org/demo-1.0"</code></td>
		<td><code>""</code></td>
	</tr>
	<tr>
		<td><code>_setComponentToCourseId</code></td>
		<td>Boolean</td>
		<td>Controls whether the 'Component' field in Trac will get set to the course _id or not. Useful if you are using one Trac site for many courses. Note: you must configure the Component field in Trac to contain the relevant course IDs (case-sensitively).</td>
		<td><code>true</code></td>
	</tr>
	<tr>
		<td colspan="2"><code>_elementsToInspect</code></td>
		<td>Array</td>
		<td>The rendered views which should be inspectable</td>
		<td><code>[ "menu", "page", "article", "block", "component" ]</code></td>
	</tr>
</table>

* Note: all attributes are optional.