# Inspector

An extension to inspect details of elements.

## Installation

* Add the following to `config.json`:
```json
"_inspector": {
	"_isEnabled": true
}
```
* Optionally, reference the [example JSON](example.json) to make Inspector link to a specific [Trac](https://trac.edgewall.org).
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
		<td>Enable Inspector globally</td>
		<td><code>false</code></td>
	</tr>
	<tr>
		<td rowspan="3"><code>_trac</code></td>
		<td><code>_isEnabled</code></td>
		<td>Boolean</td>
		<td>Link Inspector to Trac</td>
		<td><code>false</code></td>
	</tr>
	<tr>
		<td><code>_url</code></td>
		<td>String</td>
		<td>The URL of the Trac instance e.g. <code>"https://trac.edgewall.org/demo-1.0"</code></td>
		<td><code>""</code></td>
	</tr>
	<tr>
		<td><code>_params</code></td>
		<td>Object</td>
		<td>The <a href="https://trac.edgewall.org/demo-1.0/wiki/TracTickets#PresetValuesforNewTickets" target="_blank">fields</a> to pre-populate in Trac. An <code>{{inspector_location}}</code> helper is provided to print an element’s location e.g. <code> (page co-05)</code></td>
		<td><code>{ "summary": "{{_id}}{{#if displayTitle}} {{{displayTitle}}}{{/if}}{{inspector_location}}" }</code></td>
	</tr>
	<tr>
		<td colspan="2"><code>_elementsToInspect</code></td>
		<td>Array</td>
		<td>The rendered views which should be inspectable</td>
		<td><code>[ "menu", "menuItem", "page", "article", "block", "component" ]</code></td>
	</tr>
</table>
