import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function ExtractImage() {
  const [imageUrl, setImageUrl] = useState();
  const [labels, setlabels] = useState();

  const imagePicker = async () => {
    try {
      let imagePicked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 8],
        quality: 1,
      });

      if (!imagePicked.canceled) {
        setImageUrl(imagePicked.assets[0].uri);
      }

    } catch (error) {
      console.error("Error selecting Image");
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUrl) {
        alert("Please select an Image first!!");
        return;
      }

      const apiKey = "AIzaSyDXne2BVsboTVo7cAk3DQbI0KRLH7Me1uY";
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64ImageData = await FileSystem.readAsStringAsync(imageUrl, {
        encoding: FileSystem.EncodingType.Base64,
      });

 

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [
            { type: "TEXT_DETECTION", maxResults: 10 }],
          },
        ],
      };

      const apiResponse = await axios.post(apiUrl, requestData);
      console.log("apiResponse", apiResponse)
      setlabels(apiResponse);
    } catch (error) {
      console.error("Error analying Image: ", error);
      alert("Error analysing Image, Please try again");
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Upload first timer slip to simplify</Text>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300 }} />
      )}

      <TouchableOpacity onPress={imagePicker} style={styles.button}>
        <Text style={styles.buttonText}>Choose an Image ...</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text style={styles.buttonText}>Analyse slip</Text>
      </TouchableOpacity>

      {labels?.length > 0 && (
        <View style={styles.display}>
          <Text style={styles.label}>Labels:</Text>

          {labels.map((label) => (
            <Text key={label.mid} style={styles.outputText}>
              {label.description}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 50,
  },
  button: { backgroundColor:"#DDDDDD", padding:10, marginVertical:20, borderRadius: 5},
  buttonText: {fontSize: 20, fontWeight: "500"},
  display:{},
  label:{fontSize:20, fontWeight: "500", marginTop: 10},
  outputText:{fontSize: 18, fontWeight:"600", marginBottom:  20}
});
