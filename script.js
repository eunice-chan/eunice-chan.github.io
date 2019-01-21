var m = new Date().getMonth();
var s = "url('Public Domain Images/";
if (m < 2 || m == 11) {
  s += "winter";
} else if (m < 5) {
  s += "spring";
} else if (m < 8) {
  s += "summer";
} else {
  s += "fall";
}
s += ".jpg')";
document.getElementById("intro").style.backgroundImage = s;
