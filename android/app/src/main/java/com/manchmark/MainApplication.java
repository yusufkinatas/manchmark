package com.manchmark;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage; 
import io.underscope.react.fbak.RNAccountKitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNRootViewBackgroundPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new SplashScreenReactPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo(),
            new RNSoundPackage(),
            new RNLocalizePackage(),
            new ReactNativeContacts(),
            new RNAccountKitPackage(),
            new RNRootViewBackgroundPackage()
        );
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

}