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
       RNBootSplash.init(this, R.style.BootTheme);
    super.onCreate(savedInstanceState);
    }

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }
    }
}
