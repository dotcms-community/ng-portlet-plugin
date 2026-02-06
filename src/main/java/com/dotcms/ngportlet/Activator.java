package com.dotcms.ngportlet;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.osgi.GenericBundleActivator;
import com.dotmarketing.business.Layout;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.osgi.framework.BundleContext;

public class Activator extends GenericBundleActivator {

    final static String PORTLET_ID="ng-portlet";


    public void start ( BundleContext context ) throws Exception {

        //Initializing services...
        initializeServices ( context );
        // Add language key
        final Map<String, String> keys = Map.of(
                        com.dotcms.repackage.javax.portlet.Portlet.class.getPackage().getName() + ".title." + PORTLET_ID,
                        "NG Portlet");
        APILocator.getLanguageAPI().getLanguages().forEach(l -> {
            Try.run(() -> APILocator.getLanguageAPI().saveLanguageKeys(l, keys, new HashMap<>(), Set.of()));
        });
        new FileMoverUtil().copyFromJar();
        //Register our portlets
        String[] xmls = new String[]{"conf/portlet.xml"};
        registerPortlets( context, xmls );

        // add the portlet to Tools layout
        for (Layout layout : findTheToolsLayout()) {
            List<String> portletIds = new ArrayList<>(layout.getPortletIds());
            if(portletIds.contains(PORTLET_ID)){
                continue;
            }
            portletIds.add(PORTLET_ID);
            APILocator.getLayoutAPI().setPortletIdsToLayout(layout, portletIds);
        }

    }
    private List<Layout> findTheToolsLayout() throws DotDataException {
        String[] portlets = {"content"};
        List<Layout> addToLayouts = new ArrayList<>();
        List<Layout> layouts = APILocator.getLayoutAPI().findAllLayouts();
        for (Layout layout : layouts) {
            if (layout.getPortletIds().contains(PORTLET_ID)) {
                continue;
            }
            for (String portletId : portlets) {
                if (layout.getPortletIds().contains(portletId)) {
                    addToLayouts.add(layout);
                }
            }
        }
        return addToLayouts;
    }





    public void stop ( BundleContext context )  {

      unregisterPortlets();
        //Unregister all the bundle services

        //new FileMoverUtil().deleteFiles();


    }
}
