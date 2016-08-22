# EscorpioEvo17-MapManager
##Introduction
Online app to create and modify the [EscorpioEvo16-Dashboard](https://github.com/DavideMalvezzi/EscorpioEvo16-Dashboard) GPS.CFG file and 
to edit the tracks path shown in the [EscorpioEvo16-OnlineTelemetry](https://github.com/DavideMalvezzi/EscorpioEvo16-OnlineTelemetry).

To each track is associated:
- a name
- a center position, which consist of a latitude and a longitude, used to position the maps on the track center
- a set of waypoints, each one with its name, latitude and longitude
- a path shown in the [EscorpioEvo16-OnlineTelemetry](https://github.com/DavideMalvezzi/EscorpioEvo16-OnlineTelemetry).

##Functions
It's possible to add a new track or edit/remove an existent one. 

If you want to edit a track, select one from the tracks list at the top and press the edit button on the right. 
Now it's possible to edit its name, center position, waypoints set and path.

To edit the name just overwrite the name inside the textbox.

To edit the center position you can write directly the latitude and longitude values inside the textbox or press the positioning button
on the right and then left-click on the new center position on the map. If you want to cancel the positioning operation press the right 
mouse button on the map.

To edit the waypoints set, first select the waypoints edit mode from the radio button.
It's possible to add a new waypoint or edit/remove an existent one. 
To each waypoint is associated:
- a name
- a radius in meters
- a distance in meters
- a time in seconds
- a is reference flag.

To add a new waypoint click the add button near the waypoints list, then left-click on the map on the desidered position or press
the right mouse button on the map to cancel the operation. When left-clicked a modal will be showed with the waypoint settings.

Selecting a waypoint and pressing the Go button will center the map on the waypoint coordinates.

To edit the track path, first select the path edit mode from the radio button. Now it's possible to add new path points on the map
with the left mouse button or remove a point with the right mouse button.

Remember to click the save button at the bottom to save the changes.

It's also possible to download the GPS.CFG file for the [EscorpioEvo16-Dashboard](https://github.com/DavideMalvezzi/EscorpioEvo16-Dashboard)
clicking on the download button at the bottom.

