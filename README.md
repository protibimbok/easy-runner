# Easy Runner  ![Version: 1.0.1](https://img.shields.io/badge/version-1.0.1-green)
  
    
  
This extension helps you running custom commands for individual file types.  
This way you can run the commands as you would run it by typing command manually.  
This translates to more customizable, more control and more flexibility...

## To run a code
> Before using this extension make sure that associated executor is available in the `PATH` variable.  
Otherwise you'll have to define the full path in the command.

 1. Press the ![Run Code](media/play20.png) button  
 2. Or press `Ctrl + Enter` or `Ctrl + R` to run in the integrated terminal 
 2. Or press `Ctrl + Alt + Enter` or `Ctrl + Alt + R` to run in a separate window ***(Windows Only)***
  
  
![](media/howTo.png)

> ***Note: Hit save before running code and if the run icon does not appear, click inside the text editor and it should***

![Note: Don't forget to save file before running](https://img.shields.io/badge/Note-Don't%20forget%20to%20save%20file%20before%20running-red)  
  
  
## Features

  

* Run all types of files using your custom command.

* Customizable commands

  
  

## Extension Settings
This extension has four settings.  
Open the settings page in your visual studio code and search `easyRun` to view them all.  
Or you can view them from extensions.
Or add those in `settings.json` file  
  
  
***
### ***Setting:*** `File Types`  
_`easyRunner.fileTypes`_ in `settings.json`
***
<div style="margin-left: 20px">

This is where you can set the commands for different file types.  
It accepts an `Object<string, string>` as value in following format:

```json
{
    ".c"   :"command to execute for `C` files",
    ".cpp" :"command to execute for `C++` files",
    ".js"  :"command to execute for `JavaScript` files",
    ".py"  :"command to execute for `Python` files"
}
```

#### Available variables are:
    
    *  `${filePath}` : Complete file path with drives (`C:\Users\You\js\main.js` in windows) and (`/home/you/js/main.js` in Unix)
    
    *  `${fileDir}` : File directory path with drives (`C:\Users\You\js` in windows) and (`/home/you/js` in Unix)
    
    *  `${fileBaseName}` : File name (`main.js` in this case)
    
    *  `${fileNameNoExt}` : File name without extension. Suppose your file path is `C:\Users\You\js\main.js`, then it will be translated to `main`
    
    *  `${workSpacePath}` : Workspace path with drives I.e `C:\Users`
    
    *  `${fileDirWorkSpace}` : File directory path after workspace (If wokspace path is C:\Users then this will return `You\js`

***An example command can be:***
```
gcc ./${fileDirWorkSpace}/${fileBaseName} -o ./${fileDirWorkSpace}/${fileNameNoExt} && ./${fileDirWorkSpace}/${fileNameNoExt}
```
Now, suppose you `workspace path` is: `D:\Coding\C\TestProject` and the `file path`(the one you're running) is `D:\Coding\C\TestProject\core\take_input.c`  
In this case, this above command will be translated to:
```
gcc .\core\take_input.c -o .\core\take_input && .\core\take_input.c
```
>***You don't need to specify the files complete path. We will take care of this inshallah.***

#### An example of what the value can be
  
```json
{
    ".c"   :"gcc ./${fileDirWorkSpace}/${fileBaseName} -o ./${fileDirWorkSpace}/${fileNameNoExt} && ./${fileDirWorkSpace}/${fileNameNoExt}",
    ".cpp" :"gcc ./${fileDirWorkSpace}/${fileBaseName} -o ./compiled/tmp && ./compiled/tmp",
    ".js"  :"node ./${fileDirWorkSpace}/${fileBaseName}",
    ".py"  :"python ./${fileDirWorkSpace}/${fileBaseName}"
}
```  
</div>
  
***
### ***Setting:*** `Clear On Run`
_`easyRunner.clearOnRun`_ in `settings.json`  
***
<div style="margin-left: 20px">

Wheather or not to clear the terminal before running commands.  
If you don't like to let your terminal get dirty just set this option to `true`  
  
*  `easyRun.clearOnRun`: `true` or `false`

</div>

***
### ***Setting:*** `Execute Command In One Line`
_`easyRun.executeCommandInOneLine`_ in `settings.json`  
***
<div style="margin-left: 20px">
  
Set how commands should be exectuted. (One line or broken into pieces for every `&&`)
This setting will only be applied for the commands that has ` && ` in it.  
I.e:
```
gcc ./${fileDirWorkSpace}/${fileBaseName} -o ./${fileDirWorkSpace}/${fileNameNoExt} && ./${fileDirWorkSpace}/${fileNameNoExt}
```

*  `easyRun.executeCommandInOneLine`: `true` or `false`

If set `false` then the previous command will be broken down and and executed in following way:
```
gcc ./${fileDirWorkSpace}/${fileBaseName} -o ./${fileDirWorkSpace}/${fileNameNoExt}
```
After completion of running the above the following will be executed:
```
./${fileDirWorkSpace}/${fileNameNoExt}
```

> ***This options is helpful for windows users because in some cases `&&` results to an error.***
</div>

***
### ***Setting:*** `Run In Separate Window`
_`easyRun.runInSeparateWindow`_ in `settings.json`  
***
<div style="margin-left: 20px">

How ![Run Code](media/play20.png) button should run code.  
  
`true` or `false`  
  
If set `true` ![Run Code](media/play20.png) button will run code in a separate window.

![Note: This is only applicable for windows users currently](https://img.shields.io/badge/Note-This%20option%20is%20applicable%20for%20windows%20only-red)

</div>

***
## Known Issues

  
Separate terminal may not work for the linux or mac users.

If you find any then please consider texting me in [***Instagram***](https://instagram.com/alor_pretatma) or [***Twitter***](https://twitter.com/alor_pretatma)

  

## Release Notes

### ![Version: 1.0.1](https://img.shields.io/badge/version-1.0.1-green)
  
1. Added support for opening in separate window
2. Added key bindings for running code

### ![Version: 1.0.0](https://img.shields.io/badge/version-1.0.0-orange)

1. Probable bug fixed
2. Added option in editor context menu


### ![Version: 0.0.3](https://img.shields.io/badge/version-0.0.3-orange)

Added option to set commands in multiline

  

### ![Version: 0.0.2](https://img.shields.io/badge/version-0.0.2-orange)

Added directory recognition for files from outside of workspace

  

### ![Version: 0.0.1](https://img.shields.io/badge/version-0.0.1-orange)

Initial release

  

-----------------------------------------------------------------------------------------------------------

  

### For more information

  

*  [Instagram](https://instagram.com/alor_pretatma)

*  [Twitter](https://twitter.com/alor_pretatma)

  

**Enjoy!**