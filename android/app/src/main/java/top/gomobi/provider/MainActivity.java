package top.gomobi.provider;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

    private static boolean activityVisible;

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
    */
    @Override
    protected String getMainComponentName() {
        return "UberCloneProvider";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MainActivityDelegate(this, getMainComponentName());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      RNBootSplash.init(R.drawable.splash_screen, MainActivity.this); // <- display the generated bootsplash.xml drawable over our MainActivity
    }

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }
    }
}
