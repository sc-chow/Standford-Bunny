#Shading Standford Bunny
CMPT 361 - Summer 2022
Samantha Chow

#Acknowledgements
-https://www.geertarien.com/blog/2017/08/30/blinn-phong-shading-using-webgl/
-https://www.cs.uregina.ca/Links/class-info/315/WebGL/Lab3/
-https://webgl2fundamentals.org/
-https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
-https://www.lighthouse3d.com/tutorials/glsl-tutorial/point-lights/
-https://www.lighthouse3d.com/tutorials/glsl-tutorial/spotlights/

#To see webpage
Navigate to the html file in:Bunny/page.html
Click on page.html to load the webpage.

#Steps
*Translating 
    *Hold Left click on the mouse to translate the bunny on X and Y axis
    *Use Up and Down arrow key to translate the bunny on Z axis

*Rotating
    *Hold Right click on the mouse to rotate the bunny on X and Y axis
    * Press 'R' on the keyboard to reset the bunny back to its original location and orientation

*Point Light
    *Press 'P' on the keyboard to turn rotation of point light off and on.

*Spot Light
    *Press 'S' on the keyboard to turn the spanning of the spot light on and off.

#Not Done
I could not figure out how to set the spotlight source to match the rotation of the auto spanning cone. I tried multipling the view matrix by the spot light position in the vertex shader, but the results did not look right. Also, the direction of the point light changed from the middle of the bunny to its head. 

#Extra Information
The Common folder was included as the source script for MV.js is written as if the Common folder was a seperate folder in the CMPT361A3 folder. The vertex shader and the fragment shader are seperate files. 