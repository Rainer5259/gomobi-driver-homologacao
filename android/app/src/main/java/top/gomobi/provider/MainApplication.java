package top.gomobi.provider;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.rumors.reactnativesettings.RNSettingsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.horcrux.svg.SvgPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import br.com.codificar.providerbubble.RNProviderBubblePackage;
import com.github.wumke.RNImmediatePhoneCall.RNImmediatePhoneCallPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
// import com.avishayil.rnrestart.ReactNativeRestartPackage;
// import com.reactnativerestart.RestartPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
// import com.swmansion.gesturehandler.RNGestureHandlerPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.github.wumke.RNImmediatePhoneCall.RNImmediatePhoneCallPackage;
import com.imagepicker.ImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.cardio.RNCardIOPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.apsl.versionnumber.RNVersionNumberPackage;

import android.content.IntentFilter;
import io.rumors.reactnativesettings.RNSettingsPackage;
import io.rumors.reactnativesettings.receivers.GpsLocationReceiver;
import io.rumors.reactnativesettings.receivers.AirplaneModeReceiver;
import com.facebook.CallbackManager;
// import com.facebook.react.BuildConfig;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MapsPackage());
            // packages.add(new BackgroundTimerPackage());
            // packages.add(new RNCameraPackage());
            // packages.add(new ReactNativeDocumentPicker());
            // packages.add(new RNCWebViewPackage());
            // packages.add(new RestartPackage());
            // packages.add(new AsyncStoragePackage());
            // packages.add(new NetInfoPackage());
            // packages.add(new ReactNativePushNotificationPackage());
            // packages.add(new RNPromptPackage());
            // packages.add(new RNImmediatePhoneCallPackage());
            // packages.add(new ImagePickerPackage());
            // packages.add(new RNI18nPackage());
            // packages.add(new RNFSPackage());
            // packages.add(new FBSDKPackage(mCallbackManager));
            // packages.add(new RNDeviceInfo());
            // packages.add(new ReactNativeConfigPackage());
            // packages.add(new RNBackgroundGeolocation());
            // packages.add(new RNCardIOPackage());
            // packages.add(new LocationServicesDialogBoxPackage());
            // packages.add(new RNProviderBubblePackage());
            
        return packages;
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    registerReceiver(new GpsLocationReceiver(), new IntentFilter("android.location.PROVIDERS_CHANGED"));
    registerReceiver(new AirplaneModeReceiver(), new IntentFilter("android.intent.action.AIRPLANE_MODE"));
  }

}
