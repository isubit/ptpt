## Map Modes

These files contain different map draw "modes" based on the mapbox-gl-draw library.

The modes control what draw mode is active. Only one mode can be active at a time, and thus these modes are controlled by a router switch in `MapComponent`, and are mounted contingent on drawInit state to be true:
```
{drawInit
    && (
        <Switch>
            <Route path="/plant/trees/:step?" render={router => <Planting router={router} type="tree" steps={['rows', 'species', 'spacing']} {...mapModeProps} />} />
            <Route path="/plant/prairie/:step?" render={router => <Planting router={router} type="prairie" steps={['seed', 'mgmt_1', 'mgmt_2']} {...mapModeProps} />} />
            <Route path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
            <Redirect to="/" />
        </Switch>
    )}
```

On mount and update, the mode will contain logic to set the correct draw mode. The modes also self-contain their own event listeners, and render components such as data-binded forms.

When modes change, the draw and edited feature state are cleared.