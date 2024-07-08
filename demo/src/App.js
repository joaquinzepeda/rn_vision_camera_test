import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  Linking,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useFrameProcessor,
  useSkiaFrameProcessor,
  useCameraFormat
} from 'react-native-vision-camera';
import {PaintStyle, Skia, useFont, Canvas, Circle} from '@shopify/react-native-skia';


function App() {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const paint = Skia.Paint()
  paint.setColor(Skia.Color('red'))
  //const format = useCameraFormat(device, [
  //  { photoResolution: { width: 1080, height: 720 } },
  //]);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      
      setImageSource(photo.path);
      setShowCamera(false);
      console.log(photo.path);
    }
  };

  /*
  console.log("ESTO NECESITA UN FIX DE LA LIBRERIA, ES UN BUG YA REPORTADO");
  console.log('Hice un pre-fix interno cambiando una linea en la función useSkiaFrameProcessor.ts')

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet'

      //console.log(Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})) 
      const buffer = frame.toArrayBuffer()
      const data = new Uint8Array(buffer)
      //console.log(Pixel at 0,0: RGB(${data[0]}, ${data[1]}, ${data[2]}))  
      frame.render()
      
      const centerX = frame.width / 2
      const centerY = frame.height / 2
      const rect = Skia.XYWHRect(centerX, centerY, 150, 150)
      const paint = Skia.Paint()
      paint.setColor(Skia.Color('red'))
      frame.drawRect(rect, paint)  
  }, [])*/


  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'

      //console.log(Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})) 
      const buffer = frame.toArrayBuffer()
      const data = new Uint8Array(buffer)
      //console.log(Pixel at 0,0: RGB(${data[0]}, ${data[1]}, ${data[2]}))  

  }, [])

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={showCamera}
          //pixelFormat="rgb"
          frameProcessor={frameProcessor}
          photo={true}
          resizeMode={'cover'}
          //video={true}
      />

    <Canvas style={StyleSheet.absoluteFill}>
        <Circle cx={200} cy={200} r={50} color="red" />
      </Canvas>


          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => capturePhoto()}
            />
          </View>
        </>
      ) : (
        <>
          {imageSource !== '' ? (
            <Image
              style={styles.image}
              source={{
                uri: `file://'${imageSource}`,
              }}
            />
          ) : null}

          <View style={styles.backButton}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#fff',
                width: 100,
              }}
              onPress={() => setShowCamera(true)}>
              <Text style={{color: 'white', fontWeight: '500'}}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#77c3ec',
                }}
                onPress={() => setShowCamera(true)}>
                <Text style={{color: '#77c3ec', fontWeight: '500'}}>
                  Retake
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#77c3ec',
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: 'white',
                }}
                onPress={() => setShowCamera(true)}>
                <Text style={{color: 'white', fontWeight: '500'}}>
                  Use Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    //ADD backgroundColor COLOR GREY
    backgroundColor: '#B2BEB5',

    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
});

export default App;