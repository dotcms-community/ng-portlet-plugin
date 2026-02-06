# README

This bundle plugin is an example of how to create and add Portlets for use in the dotCMS' administrative console using an OSGI bundle plugin.
This example includes the code to create three different types of Portlets, all of which are supported by dotCMS:
* **Velocity Portlet**: a Portlet implementation that will display portlet content using a velocity file
* **Jsp Portlet**: a Portlet implementation that will display portlet content using a jsp file
* **Struts Portlet**: a Portlet implementation  that will call an Struts Action class that will use a jsp file in order to display portlet content.

## How to build this example

To build the JAR, run the following Maven command: 
```sh
mvn clean install
```

This will generate the plugin JAR in the `target` directory.

## How to install this bundle

* **To install this bundle:**

  Copy the bundle JAR file inside the Felix OSGI container (`dotCMS/felix/load`).

  OR

  Upload the bundle JAR file using the dotCMS UI (`CMS Admin -> Plugins -> Upload Plugin`).

* **To uninstall this bundle:**

  Remove the bundle JAR file from the Felix OSGI container (`dotCMS/felix/load`).

  OR

  Undeploy the bundle JAR using the dotCMS UI (`CMS Admin -> Plugins -> Undeploy`).

## How to create a bundle plugin for Annotation Framework based on AOP  

In order to create this OSGI plugin, Maven is configured to generate the `META-INF/MANIFEST.MF` file automatically. If needed, you can customize the configuration in the `pom.xml`.

Below is a description of the required fields in the `MANIFEST.MF` and how they are configured in a `pom.xml`:

> **Bundle-Name:** The name of your bundle  
> **Bundle-SymbolicName:** A short and unique name for the bundle  
> **Bundle-Vendor:** The vendor of the bundle (example: dotCMS)  
> **Bundle-Description:** A brief description of the bundle  
> **Bundle-DocURL:** URL for the bundle documentation  
> **Bundle-Activator:** Package and name of your Activator class (example: com.dotmarketing.osgi.actionlet.Activator)  
> **Export-Package:** Declares the packages that are visible outside the plugin. Any package not declared here has visibility only within the bundle.  
> **Import-Package:** This is a comma-separated list of the names of packages to import. This list must include the packages that you are using inside your OSGI bundle plugin and are exported and exposed by the dotCMS runtime.

These fields are configured in the `pom.xml` as follows:

```xml
<plugin>
    <groupId>org.apache.felix</groupId>
    <artifactId>maven-bundle-plugin</artifactId>
    <version>5.1.9</version>
    <extensions>true</extensions>
    <configuration>
        <instructions>
            <Bundle-Name>Your Bundle Name</Bundle-Name>
            <Bundle-SymbolicName>com.example.yourbundle</Bundle-SymbolicName>
            <Bundle-Vendor>dotCMS</Bundle-Vendor>
            <Bundle-Description>dotCMS - OSGI Actionlet example</Bundle-Description>
            <Bundle-DocURL>https://dotcms.com/</Bundle-DocURL>
            <Bundle-Activator>com.dotmarketing.osgi.actionlet.Activator</Bundle-Activator>
            <Export-Package>com.example.yourbundle.package</Export-Package>
            <Import-Package>*</Import-Package>
        </instructions>
    </configuration>
</plugin>
```

## Beware (!)

In order to work inside the Apache Felix OSGI runtime, the import and export directives must be bidirectional:

* **Exported Packages**

  The dotCMS must declare the set of packages that will be available to the OSGI plugins by updating the file: `dotCMS/WEB-INF/felix/osgi-extra.conf`.
  This can also be configured using the dotCMS UI (`CMS Admin -> Plugins -> Exported Packages`).

  Only after the exported packages are defined in this list, can a plugin import the packages to use them inside the OSGI bundle.

* **Fragment (Deprecated)**

  Previously, a bundle fragment was used to make its contents available to other bundles by exporting 3rd party libraries from dotCMS. Fragments do not participate in the lifecycle of the bundle and therefore cannot have a Bundle-Activator. As this is no longer required, this section is deprecated.

---
## Components

### Resources:

* **conf/** Folder (Folder that contains the configuration files for the Portlets definitions) - Both files in this folder are MANDATORY (!)
    * **conf/portlet.xml** The standard JSR-286 portlet configuration file.
    * **conf/liferay-portlet.xml** This file describes some optional Liferay-specific enhancements for JSR-286 portlets that are installed on a Liferay Portal server.

* **ext/** Folder (Folder that contains the files used by the defined Portles)
    * **ext/view.vtl** Velocity file used by the Velocity Portlet
    * **ext/hello.jsp** Jsp file use it by the Jsp Portlet
    * **ext/strutshelloworld/view.jsp** Used by the Struts Portlet and invoked inside the *HelloWorldAction*
    * **ext/strutshelloworld/view_hello.jsp** Used by the Struts Portlet and invoked inside the *HelloWorldAction*

### com.dotmarketing.osgi.portlet.HelloWorldAction

Simple Action class that extends *com.dotmarketing.portal.struts.DotPortletAction*
The *conf/portlet.xml* file has the definition for an *StrutsPortlet* and that definition has a reference to the mapping for the *HelloWorldAction*.

### Activator

This bundle activator extends *com.dotmarketing.osgi.GenericBundleActivator* and implements *BundleActivator.start()*.
This activator have 2 main important fragments of code:
* It will manually register an *ActionMapping* for our Struts action class *HelloWorldAction* that will be used by the StrutsPortlet we defined in the configuration files (*conf/*).
* It will manually register the Portlets making use of the method *registerPortlets*.

**PLEASE note** the *unregisterServices()* call on the *stop* method, this call is MANDATORY (!) as it will allow us to clean and remove the registered Portlets and related code (like the ActionMappings registered in Struts  ).

### Multi language support

The creation of the Portlets will generate the following language keys and use them as the title for the Portlets:
* javax.portlet.title.EXT_HELLO_WORLD
* javax.portlet.title.EXT_JSP_HELLO_WORLD
* javax.portlet.title.EXT_STRUTS_HELLO_WORLD

In order to add multilanguage values for those keys:
*CMS Admin* -> *Language Variables* -> *Edit Default Language Variables* -> Add the values for the above keys
  	
