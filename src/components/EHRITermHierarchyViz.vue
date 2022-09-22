<template>
  <div class="hierarchy" v-if="viz.length" v-html="viz"></div>
</template>

<script>
import { toRef, ref, watch } from "vue";
import * as d3 from "d3";

export default {
  name: "EHRITermHierarchyViz",
  props: {
    broader: Array,
    narrower: Array,
    selected: Object,
  },
  setup(props) {
    const broader = toRef(props, "broader");
    const narrower = toRef(props, "narrower");
    const selected = toRef(props, "selected");
    const vizData = ref({
      name: "",
      children: [],
    });

    const viz = ref();

    const getVizData = () => {
      vizData.value = {
        name: "",
        children: [],
      }
      viz.value = null
      if (broader.value.length && narrower.value.length) {
        if(broader.value.length>1){
          vizData.value["name"] = "EHRI Terms"
          broader.value.forEach(b => {
            vizData.value["children"].push(
                {
                  "name": b.name,
                  "children": [
                    {
                      "name": selected.value.name,
                      "children": []
                    }
                  ]
                }
            )
          })
          vizData.value["children"].forEach(child =>
              child.children.forEach(grandchild=> {
                narrower.value.forEach(n => grandchild.children.push({"name": n.name}))
              })
          )
        } else if (broader.value.length==1){
          vizData.value["name"] = broader.value[0].name
          vizData.value["children"].push({
            "name": selected.value.name,
            "children": [
            ]
          })
          vizData.value["children"].forEach(grandchild=> {
                narrower.value.forEach(n => grandchild.children.push({"name": n.name}))
              })
        }
      } else if (broader.value.length && !narrower.value.length) {
        if(broader.value.length>1){
          vizData.value["name"] = "EHRI Terms"
          broader.value.forEach(b => vizData.value.children.push(
              {
                name: b.name,
                children: [{
                  "name": selected.value.name
                }]
              }
          )
          )
        } else {
          vizData.value["name"] = broader.value[0].name
          vizData.value.children.push({
            name: selected.value.name
          })
        }
      } else if (narrower.value.length && !broader.value.length) {
        vizData.value["name"] = selected.value.name;
        narrower.value.forEach((c) => {
          let tempObj = {
            name: c.name,
          };
          vizData.value.children.push(tempObj);
        });
      }
    };


    const createViz = () => {
      getVizData();
      viz.value = Tree(vizData.value, {
        label: (d) => d.name,
        // link: (d) => d.link,
      }).outerHTML;
    };

    createViz();

    watch([broader,narrower, selected], () => {
      createViz();
    });

    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/tree
    function Tree(
        data,
        {
          // data is either tabular (array of objects) or hierarchy (nested objects)
          path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
          id = Array.isArray(data) ? (d) => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
          parentId = Array.isArray(data) ? (d) => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
          children, // if hierarchical data, given a d in data, returns its children
          tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
          sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
          label, // given a node d, returns the display name
          title, // given a node d, returns its hover text
          identifier,
          link, // given a node d, its link (if any)
          linkTarget = "_blank", // the target attribute for links (if any)
          width =1000, // outer width, in pixels
          height, // outer height, in pixels
          r = 3, // radius of nodes
          padding = 3, // horizontal padding for first and last column
          fill = "#999", // fill for nodes
          fillOpacity, // fill opacity for nodes
          stroke = "#555", // stroke for links
          strokeWidth = 1.5, // stroke width for links
          strokeOpacity = 0.4, // stroke opacity for links
          strokeLinejoin, // stroke line join for links
          strokeLinecap, // stroke line cap for links
          halo = "#fff", // color of label halo
          haloWidth = 3, // padding around the labels
        } = {}
    ) {
      // If id and parentId options are specified, or the path option, use d3.stratify
      // to convert tabular data to a hierarchy; otherwise we assume that the data is
      // specified as an object {children} with nested objects (a.k.a. the “flare.json”
      // format), and use d3.hierarchy.
      const root =
          path != null
              ? d3.stratify().path(path)(data)
              : id != null || parentId != null
                  ? d3.stratify().id(id).parentId(parentId)(data)
                  : d3.hierarchy(data, children);

      // Compute labels and titles.
      const descendants = root.descendants();
      const L = label == null ? null : descendants.map((d) => label(d.data, d));

      // Sort the nodes.
      if (sort != null) root.sort(sort);

      // Compute the layout.
      const dx = 10;
      const dy = width / (root.height + padding);
      tree().nodeSize([dx+2, dy])(root);

      // Center the tree.
      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });

      // Compute the default height.
      if (height === undefined) height = x1 - x0 + dx * 2;

      const svg = d3
          .create("svg")
          .attr("viewBox", [(-dy * padding) / 2, x0 - dx, width, height])
          .attr("width", width)
          .attr("height", height)
          .attr("style", "max-width: 100%; height:19em; ")
          .attr("font-family", "sans-serif")
          .attr("font-size", 13)

      svg
          .append("g")
          .attr("fill", "none")
          .attr("stroke", stroke)
          .attr("stroke-opacity", strokeOpacity)
          .attr("stroke-linecap", strokeLinecap)
          .attr("stroke-linejoin", strokeLinejoin)
          .attr("stroke-width", strokeWidth)
          .selectAll("path")
          .data(root.links())
          .join("path")
          .attr(
              "d",
              d3
                  .linkHorizontal()
                  .x((d) => d.y)
                  .y((d) => d.x)
          );

      const node = svg
          .append("g")
          .selectAll("a")
          .data(root.descendants())
          .join("a")
          .attr(
              "identifier",
              identifier == null ? null : (d) => identifier(d.data, d)
          )
          .attr("xlink:href", link == null ? null : (d) => link(d.data, d))
          .attr("target", link == null ? null : linkTarget)
          .attr("transform", (d) => `translate(${d.y},${d.x})`)
          .attr("fill", (d) =>
              d.data.name === selected.value.name ? "#6C003B" : "#000"
          )

      node
          .append("circle")
          .attr("fill", (d) =>
              d.data.name === selected.value.name ? "#6C003B" : fill
          )
          .attr("r", r);

      if (title != null) node.append("title").text((d) => title(d.data, d));

      if (L)
        node
            .append("text")
            .attr("class", "text")
            .attr("dy", "0.32em")
            .attr("x", (d) => (d.children ? -6 : 6))
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d, i) => L[i])
            .call((text) => text.clone(true))
            .attr("fill", null)
            .attr("stroke", halo)
            .attr("stroke-width", haloWidth)

      return svg.node();
    }

    return {
      viz,
    };
  },
};
</script>

<style>
.hierarchy {
  border: 0.1em dotted #330033;
  background-color: #FFFFFF;
  padding: 0.3em;
  overflow: scroll;
}
</style>
