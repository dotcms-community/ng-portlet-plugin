package com.dotcms.ngportlet;



import com.dotmarketing.exception.DotRuntimeException;

import com.dotmarketing.util.Logger;

import com.liferay.util.FileUtil;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import java.util.jar.JarEntry;
import java.util.stream.Collectors;

import org.apache.commons.io.IOUtils;

public class FileMoverUtil {

   /**
    * PORTLET_INSTALL_PATH has got to match the angular-module path in your portlet.xml
    */
    private  static final String srcDirectoryInJar = "/frontend";
    private static final File destDirectoryInWar = new File(FileUtil.getRealPath("/dotAdmin/plugins/ng-portlet"));


   private static List<JarEntry> listFilesInFrontend() {

      String packagePath = stripPackagePath(srcDirectoryInJar);
      List<JarEntry> jarEntries = new ArrayList<>();

      try {
         String jarPath = FileMoverUtil.class.getProtectionDomain().getCodeSource().getLocation().getPath();
         try (java.util.jar.JarFile jarFile = new java.util.jar.JarFile(jarPath)) {
            java.util.Enumeration<java.util.jar.JarEntry> entries = jarFile.entries();
            while (entries.hasMoreElements()) {
               JarEntry entry = entries.nextElement();
               if (!entry.getName().startsWith(packagePath + "/") || entry.getName()
                       .equalsIgnoreCase(packagePath + "/")) {
                  continue;
               }
               Logger.info(FileMoverUtil.class,"jar path:" + entry.getName());
               jarEntries.add(entry);

            }
         }
      } catch (java.io.IOException e) {
         throw new RuntimeException("Error reading JAR file", e);
      }
      return jarEntries;
   }




   private static String stripPackagePath(String packagePathInJar) {
      return packagePathInJar.startsWith("/") && packagePathInJar.endsWith("/")
              ? packagePathInJar.substring(1, packagePathInJar.length() - 1)
              : packagePathInJar.startsWith("/")
                      ? packagePathInJar.substring(1)
                      : packagePathInJar.endsWith("/")
                              ? packagePathInJar.substring(0, packagePathInJar.length() - 1)
                              : packagePathInJar;
   }


   /**
    * Moves files from the plugin jar to the dotCMS virtual file system as fileAssets. If you do not specify a host,
    * they will be placed on the default host
    *
    * @param packagePathInJar - the directory path in the jar to copy
    * @param site             - the site to copy to
    */
   void copyFromJar() {

      destDirectoryInWar.mkdirs();
      List<JarEntry> fileList = listFilesInFrontend().stream().filter(e -> !e.isDirectory())
              .collect(Collectors.toList());

      try {

         for (JarEntry e : fileList) {

            String fileName = e.getName().substring(e.getName().lastIndexOf("/") + 1);

            File filePath = new File(destDirectoryInWar,fileName);


            System.out.println("Writing File:" + filePath);

            try (final InputStream in = this.getClass().getResourceAsStream("/" + e.getName())) {
               IOUtils.copy(in, Files.newOutputStream(filePath.toPath()));
            } catch (IOException ioe) {
               Logger.error(this.getClass(), "Error moving file: " + e.getName(), ioe);
               continue;
            }



         }
         ;
      } catch (Exception e) {
         throw new DotRuntimeException("Error moving files from jar to file assets:" + e.getMessage(), e);
      }

   }


   void deleteFiles()  {


      FileUtil.deltree(destDirectoryInWar);


   }

}
