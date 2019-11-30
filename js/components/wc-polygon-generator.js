const svgns = "http://www.w3.org/2000/svg";

customElements.define("wc-polygon-generator",
	class extends HTMLElement {
		static get observedAttributes(){
			return [];
		}
		constructor(){
			super();
			this.bind(this);
		}
		bind(element){
			element.attachEvents = element.attachEvents.bind(element);
			element.render = element.render.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
			element.generate = element.generate.bind(element);
		}
		connectedCallback(){
			this.render();
			this.cacheDom();
			this.attachEvents();
		}
		render(){
			this.attachShadow({ mode: "open" });
			this.shadowRoot.innerHTML = `
				<style>
					label, button { display: block; }
					:host { display: grid; grid-template-columns: [form] 50% [output] 50%; }
					#form { grid-column: form; }
					#output { grid-column: output; }
				</style>
				<div id="form">
					<label for="side-count">Sides:</label>
					<input id="side-count" type="phone" value="3" />
					<label for="radius">Radius:</label>
					<input id="radius" value="25" />
					<label for="rotation">Rotation:</label>
					<input id="rotation" value="0" />
					<label for="stroke">Stroke:</label>
					<input id="stroke" value="black" />
					<label for="stroke-width">Stroke Width:</label>
					<input id="stroke-width" value="1" />
					<label for="fill">Fill:</label>
					<input id="fill" value="transparent" />
					<button id="generate">Generate</button>
				</div>
				<div id="output"></div>
			`
		}
		cacheDom(){
			this.dom = {
				sideCount : this.shadowRoot.querySelector("#side-count"),
				radius : this.shadowRoot.querySelector("#radius"),
				rotation: this.shadowRoot.querySelector("#rotation"),
				stroke: this.shadowRoot.querySelector("#stroke"),
				strokeWidth: this.shadowRoot.querySelector("#stroke-width"),
				fill: this.shadowRoot.querySelector("#fill"),
				generate: this.shadowRoot.querySelector("#generate"),
				output: this.shadowRoot.querySelector("#output")
			};
		}
		attachEvents(){
			this.dom.generate.addEventListener("click", this.generate);
		}
		generate(){
			const sideCount = parseInt(this.dom.sideCount.value, 10);
			const anglePerSide = 2 * Math.PI / sideCount;
			const radius = parseFloat(this.dom.radius.value);
			const rotation = parseFloat(this.dom.rotation.value) * Math.PI/180;
			const stroke = this.dom.stroke.value;
			const strokeWidth = parseFloat(this.dom.strokeWidth.value);
			const fill = this.dom.fill.value;

			const polarPoints = [];
			let currentTheta = rotation;

			for(let i = 0; i < sideCount; i++){
				polarPoints.push([radius, currentTheta]);
				currentTheta += anglePerSide;
			}
			
			const normalizedPoints = polarPoints.map(([r,theta]) => [r * Math.cos(theta) + radius, r * Math.sin(theta) + radius]);

			const svg = document.createElementNS(svgns, "svg");
			svg.setAttributeNS(null, "height", radius * 2);
			svg.setAttributeNS(null, "width", radius * 2);
			const polygon = document.createElementNS(svgns, "polygon");
			polygon.setAttributeNS(null, "points", normalizedPoints.map(p => p.join(",")).join(" "));
			polygon.setAttributeNS(null, "fill", fill);
			polygon.setAttributeNS(null, "stroke", stroke);
			polygon.setAttributeNS(null, "stroke-width", strokeWidth);
			svg.appendChild(polygon);
			this.dom.output.innerHTML = "";
			this.dom.output.appendChild(svg);
		}
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
	}
)
