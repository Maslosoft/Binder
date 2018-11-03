#
# GMap3 binding
# TODO Allow syntax:
# data-bind="googleMap: config"
# TODO When using two or more trees from same data, only first one works properly
#
class @Maslosoft.Binder.GoogleMap extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		@apply(element, @getValue(valueAccessor))

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		@apply(element, @getValue(valueAccessor))


	apply: (element, cfg) =>
		console.log element, cfg
		latLng = new google.maps.LatLng cfg.lat, cfg.lng
		mapOptions =
			zoom: cfg.zoom
			center: latLng
			mapTypeId: cfg.type


		map = new google.maps.Map element, mapOptions

		if cfg.markers
			markerCfg =
				position: latLng
				map: map
			new google.maps.Marker markerCfg
