import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import { css } from "./assets/css/Css";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "./config";
import MapViewDirections from "react-native-maps-directions";

export default function App() {
  const mapEl = useRef(null);
  const [origin, setOrigem] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async function () {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        setOrigem({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.000922,
          longitudeDelta: 0.000421,
        });
        console.log("Origem");
        console.log(location);
      } else {
        throw new Error("Permissão de localização não garantida");
      }
    })();
  }, []);

  return (
    <View style={css.container}>
      {/* <Image source={require("./img/logo.png")}></Image> */}
      <MapView
        style={css.map}
        initialRegion={origin}
        showsUserLocation={true}
        loadingEnabled={true}
        ref={mapEl}
      >
        {destination && ( //se houver destino
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={config.googleApi}
            strokeWidth={3}
            strokeColor="#ff3500"
            onReady={(result) => {
              setDistance(result.distance);
              mapEl.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  // configuração dos traçados em px
                  top: 50,
                  bottom: 50,
                  left: 50,
                  right: 50,
                },
              });
              console.log("Destino");
              console.log(result);
            }}
          />
        )}
      </MapView>

      <View style={css.search}>
        <GooglePlacesAutocomplete
          placeholder="Seu destino?"
          onPress={(data, details = null) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.000421,
            });
          }}
          query={{
            key: config.googleApi,
            language: "pt-br",
          }}
          enablePoweredByContainer={false}
          fetchDetails={true} // nos da os resultados da busca em detalhes
          styles={{ listView: { height: 100 } }} //lista de sugestão de busca
        />
        <View>{distance && <Text> Distancia: {distance}m</Text>}</View>
      </View>
    </View>
  );
}
