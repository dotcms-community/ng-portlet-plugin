package com.dotcms.ngportlet;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.osgi.GenericBundleActivator;

import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.jar.JarEntry;

import javax.annotation.Nonnull;

import org.osgi.framework.BundleContext;

public class Activator extends GenericBundleActivator {



    public void start ( BundleContext context ) throws Exception {

        //Initializing services...
        initializeServices ( context );
        // Add language key
        final Map<String, String> keys = Map.of(
                        com.dotcms.repackage.javax.portlet.Portlet.class.getPackage().getName() + ".title.ng-portlet",
                        "NG Portlet");
        APILocator.getLanguageAPI().getLanguages().forEach(l -> {
            Try.run(() -> APILocator.getLanguageAPI().saveLanguageKeys(l, keys, new HashMap<>(), Set.of()));
        });
        new FileMoverUtil().copyFromJar();
        //Register our portlets
        String[] xmls = new String[]{"conf/portlet.xml"};
        registerPortlets( context, xmls );
    }

    public void stop ( BundleContext context ) throws Exception {

      unregisterPortlets();
        //Unregister all the bundle services

        new FileMoverUtil().deleteFiles();


    }
}
