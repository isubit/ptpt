## Map Layers

These files wrap a `Layer` component that controls the map layer and its events.

The `Layer` component expects at least these props:
`map` - the map object, from the `MapComponent`
`layer` - the layer object, refer to the Mapbox GL JS Style Spec

Optionally, the component also accepts an `events` prop, which is a ES6 Map which contains the event and its handler function.
E.g.
```
let events = [
		['click', e => {
			// Do some stuff here onClick...
		}],
	];
	events = new Map(events);
    return <Layer map={map} layer={layer} events={events} />;
```

These layer components are rendered in the `MapComponent`, contingent on the `sourcesAdded` state to be true. Trying to add a layer before its source is added will throw an error. The layer components themselves can receive any props necessary to compose the layer and event logic.
E.g.
```
{sourcesAdded
    && (
        <>
            <Area map={map} />
            <Outline map={map} />
            <EditIcons map={map} data={data} setEditingFeature={setEditingFeature} nextStep={nextStep} />
        </>
    )}
```