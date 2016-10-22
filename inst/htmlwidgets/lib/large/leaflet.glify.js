!function(t,e,r,i){function a(t){var e,r=n.defaults,i={};for(e in r)r.hasOwnProperty(e)&&(i[e]=t.hasOwnProperty(e)?t[e]:r[e]);return i}function n(e){if(this.settings=a(e),!e.vertexShader)throw new Error('no "vertexShader" string setting defined');if(!e.fragmentShader)throw new Error('no "fragmentShader" string setting defined');if(!e.data)throw new Error('no "data" array setting defined');if(!e.map)throw new Error('no leaflet "map" object setting defined');var i=this.glLayer=r.canvasOverlay().drawing(function(t){this.drawOnCanvas(t)}.bind(this)).addTo(e.map),n=this.canvas=i.canvas();n.width=n.clientWidth,n.height=n.clientHeight,t.WebGLRenderingContext?(n=this.canvas=i.canvas(),this.gl=this.canvas.getContext("webgl",{antialias:!0})||n.getContext("experimental-webgl",{antialias:!0}),this.gl||(t.location="http://get.webgl.org/troubleshooting")):t.location="http://get.webgl.org",this.pixelsToWebGLMatrix=new Float32Array(16),this.mapMatrix=new Float32Array(16),this.vertexShader=null,this.fragmentShader=null,this.program=null,this.uMatrix=null,this.verts=null,this.latLngLookup=null,this.setup().render()}function s(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16)/255,g:parseInt(e[2],16)/255,b:parseInt(e[3],16)/255}:null}n.defaults={map:null,data:[],debug:!1,vertexShader:"",fragmentShader:"",pointThreshold:10,clickPoint:null,toggleLayer:null,color:[],baseLayers:[]},n.prototype={setup:function(){var t=this,e=this.settings;return e.toggleLayer&&e.map.on("viewreset",function(t){toggle?map.addLayer(glLayer):map.removeLayer(glLayer),toggle=!toggle}),e.clickPoint&&e.map.on("click",function(r){var i=t.lookup(r.latlng);null!==i&&e.clickPoint(i,r),e.debug&&t.debugPoint(r.containerPoint)}),this.setupVertexShader().setupFragmentShader().setupProgram()},render:function(){var t=$("<div id='lnlt'></div>").text('<button onclick="switchLayer()">Append text</button>');if($("lnlt").append(t),this.verts=[],this.latLngLookup={},this.settings.color.length<=7){if("#"!=this.settings.color[1].substring(0,1))var e=s(this.settings.color)}else var e=s(this.settings.color[this.settings.color.length-1]);var r=this.settings,a=r.color,n="#460000",o=e;o===i&&(o=a),o.call!==i&&(a=o),a.call!==i?(n=a,this.settings.data.map(function(t,e){for(var r=[],i=2;i<t.length;i++)r[i-2]=t[i];var a=this.latLngToPixelXY(t[1],t[0],r),s=n(10);this.verts.push(a.x,a.y,s.r,s.g,s.b)}.bind(this))):this.settings.data.map(function(t,e){for(var r=[],e=2;e<t.length;e++)r[e-2]=t[e];var i=this.latLngToPixelXY(t[1],t[0],r);this.verts.push(i.x,i.y,o.r,o.g,o.b)}.bind(this));var h=this.gl,l=this.canvas,g=this.program,u=this.glLayer,d=this.uMatrix=h.getUniformLocation(g,"uMatrix"),c=h.getAttribLocation(g,"aColor"),f=h.getAttribLocation(g,"aVertex"),p=h.createBuffer(),x=new Float32Array(this.verts),v=x.BYTES_PER_ELEMENT;return h.aPointSize=h.getAttribLocation(g,"aPointSize"),this.pixelsToWebGLMatrix.set([2/l.width,0,0,0,0,-2/l.height,0,0,0,0,0,0,-1,1,0,1]),h.viewport(0,0,l.width,l.height),h.uniformMatrix4fv(d,!1,this.pixelsToWebGLMatrix),h.bindBuffer(h.ARRAY_BUFFER,p),h.bufferData(h.ARRAY_BUFFER,x,h.STATIC_DRAW),h.vertexAttribPointer(f,2,h.FLOAT,!1,5*v,0),h.enableVertexAttribArray(f),h.vertexAttribPointer(c,3,h.FLOAT,!1,5*v,2*v),h.enableVertexAttribArray(c),u.redraw(),this},setData:function(t){return this.settings.data=t,this},setupVertexShader:function(){var t=this.gl,e=t.createShader(t.VERTEX_SHADER);return t.shaderSource(e,this.settings.vertexShader),t.compileShader(e),this.vertexShader=e,this},setupFragmentShader:function(){var t=this.gl,e=t.createShader(t.FRAGMENT_SHADER);return t.shaderSource(e,this.settings.fragmentShader),t.compileShader(e),this.fragmentShader=e,this},setupProgram:function(){var t=this.gl,e=t.createProgram();return t.attachShader(e,this.vertexShader),t.attachShader(e,this.fragmentShader),t.linkProgram(e),t.useProgram(e),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),this.program=e,this},drawOnCanvas:function(t){if(null==this.gl)return this;var e=this.gl,i=this.canvas,a=this.settings.map,n=a.getZoom(),s=a.getBounds(),o=new r.LatLng(s.getNorth(),s.getWest()),h=this.latLngToPixelXY(o.lat,o.lng),l=Math.pow(2,n),g=n/10*n;return e.clear(e.COLOR_BUFFER_BIT),this.pixelsToWebGLMatrix.set([2/i.width,0,0,0,0,-2/i.height,0,0,0,0,0,0,-1,1,0,1]),e.viewport(0,0,i.width,i.height),e.vertexAttrib1f(e.aPointSize,g),this.mapMatrix.set(this.pixelsToWebGLMatrix),this.scaleMatrix(l,l).translateMatrix(-h.x,-h.y),e.uniformMatrix4fv(this.uMatrix,!1,this.mapMatrix),e.drawArrays(e.POINTS,0,this.settings.data.length),this},latLngToPixelXY:function(t,e,r){var a,n=Math.PI/180,s=4*Math.PI,o=Math.sin(t*n),h=256*(.5-Math.log((1+o)/(1-o))/s),l=(e+180)/360*256,g=t.toFixed(5)+"x"+e.toFixed(5),u=this.latLngLookup[g];return a={lat:t,lng:e,a:r,x:l,y:h,key:g},u===i&&(u=this.latLngLookup[g]=[]),u.push(a),a},translateMatrix:function(t,e){var r=this.mapMatrix;return r[12]+=r[0]*t+r[4]*e,r[13]+=r[1]*t+r[5]*e,r[14]+=r[2]*t+r[6]*e,r[15]+=r[3]*t+r[7]*e,this},scaleMatrix:function(t,e){var r=this.mapMatrix;return r[0]*=t,r[1]*=t,r[2]*=t,r[3]*=t,r[4]*=e,r[5]*=e,r[6]*=e,r[7]*=e,this},addTo:function(t){return this.glLayer.addTo(t),this.layerControl.addOverlay(this.glLayer,"points"),this},lookup:function(t){for(var e,r,i,a,n,s=t.lat-.004,o=t.lat+.003,h=t.lng+.003,l=[];o>=s;s+=1e-5)for(e=t.lng-.004;h>=e;e+=1e-5)if(n=s.toFixed(5)+"x"+e.toFixed(5),a=this.latLngLookup[n])for(r=0,i=a.length;i>r;r++)a[r].key=n,l.push(a[r]);return this.closestPoint(t,l)},closestPoint:function(t,e){function r(t,e){return Math.sqrt(t*t+e*e)}function i(t,e){var i=t.lat-e.lat,a=t.lng-e.lng;return r(i,a)}return e.reduce(function(e,r){var a=i(t,e),n=i(t,r);return n>a?e:r})},debugPoint:function(t){var r=e.createElement("div"),i=r.style,a=t.x,n=t.y;return i.left=a+"px",i.top=n+"px",i.width="100px",i.height="100px",i.position="absolute",i.backgroundColor="#"+(16777215*Math.random()<<0).toString(16),e.body.appendChild(r),this}},r.glify=function(t){return new r.Glify(t)},r.Glify=n}(window,document,L);