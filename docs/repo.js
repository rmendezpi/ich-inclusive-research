// ICH Inclusive Research Repository: filtering and display.
// No external libraries. Reads the CSV files in /data.

(function () {
  "use strict";

  var STUDY_TYPES = [
    "Clinical trials and studies",
    "Laboratory and animal research",
    "Population, observational and qualitative research"
  ];

  var STAGES = [
    "Funding application", "Study design", "Co-production and PPIE",
    "Recruitment and retention", "Data collection", "Analysis",
    "Reporting and dissemination", "Ethics", "Training and learning"
  ];

  // Minimal CSV parser that handles quoted fields, commas and line breaks.
  function parseCSV(text) {
    var rows = [], row = [], field = "", i = 0, q = false;
    text = text.replace(/^﻿/, "");
    while (i < text.length) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
        if (c === '"') { q = false; i++; continue; }
        field += c; i++; continue;
      }
      if (c === '"') { q = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    var head = rows.shift() || [];
    return rows
      .filter(function (r) { return r.some(function (x) { return x.trim() !== ""; }); })
      .map(function (r) {
        var o = {};
        head.forEach(function (h, k) { o[h.trim()] = (r[k] || "").trim(); });
        return o;
      });
  }

  function split(s) {
    return (s || "").split(";").map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) {
      if (c == null || c === "") return;
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }

  function titleNode(text, url) {
    if (!url) return text;
    return el("a", { href: url, target: "_blank", rel: "noopener" }, [text]);
  }

  function option(value, label) {
    var o = document.createElement("option");
    o.value = value; o.textContent = label || value;
    return o;
  }

  // ---------- Frameworks and guidance ----------
  function initResources(root) {
    var search = root.querySelector("#f-search");
    var stage = root.querySelector("#f-stage");
    var type = root.querySelector("#f-type");
    var count = root.querySelector("#f-count");
    var list = root.querySelector("#f-list");

    stage.appendChild(option("", "All stages"));
    STAGES.forEach(function (s) { stage.appendChild(option(s)); });
    type.appendChild(option("", "All study types"));
    STUDY_TYPES.forEach(function (s) { type.appendChild(option(s)); });

    fetch("data/resources.csv")
      .then(function (r) { return r.text(); })
      .then(function (t) {
        var data = parseCSV(t).filter(function (d) { return d.status === "published"; });

        function render() {
          var q = search.value.trim().toLowerCase();
          var shown = data.filter(function (d) {
            var types = split(d.study_types);
            var text = [d.title, d.publisher, d.description, d.stages, d.study_types, d.category].join(" ").toLowerCase();
            if (q && text.indexOf(q) === -1) return false;
            if (stage.value && split(d.stages).indexOf(stage.value) === -1) return false;
            if (type.value && types.indexOf("Any") === -1 && types.indexOf(type.value) === -1) return false;
            return true;
          });
          count.textContent = "Showing " + shown.length + " of " + data.length + " resources";
          list.innerHTML = "";
          if (!shown.length) {
            list.appendChild(el("div", { "class": "empty" },
              ["No resources match these filters. Try clearing the search or choosing All stages."]));
            return;
          }
          var grid = el("div", { "class": "cards" });
          shown.forEach(function (d) {
            var tags = el("div", { "class": "tags" });
            if (d.costing_involvement === "yes") tags.appendChild(el("span", { "class": "tag costing" }, ["Costing involvement"]));
            split(d.stages).forEach(function (s) { tags.appendChild(el("span", { "class": "tag" }, [s])); });
            split(d.study_types).filter(function (x) { return x !== "Any"; })
              .forEach(function (x) { tags.appendChild(el("span", { "class": "tag dept" }, [x])); });
            grid.appendChild(el("article", { "class": "card-item" }, [
              el("h3", {}, [titleNode(d.title, d.url)]),
              el("p", { "class": "publisher" }, [d.publisher + (d.year ? " (" + d.year + ")" : "")]),
              el("p", { "class": "desc" }, [d.description]),
              tags
            ]));
          });
          list.appendChild(grid);
        }

        [search, stage, type].forEach(function (c) {
          c.addEventListener("input", render);
          c.addEventListener("change", render);
        });
        render();
      })
      .catch(function () {
        count.textContent = "The list could not be loaded. Download it as a spreadsheet instead.";
      });
  }

  // ---------- ICH examples ----------
  function initExamples(root) {
    var search = root.querySelector("#e-search");
    var count = root.querySelector("#e-count");
    var list = root.querySelector("#e-list");

    fetch("data/ich_examples.csv")
      .then(function (r) { return r.text(); })
      .then(function (t) {
        var data = parseCSV(t);
        if (!data.length) {
          search.closest(".filters").hidden = true;
          var a = el("a", { href: "submit.html" }, ["share your work"]);
          list.appendChild(el("div", { "class": "empty" },
            [el("strong", {}, ["No examples yet. "]), "Be one of the first: ", a, " in about two minutes."]));
          return;
        }
        function render() {
          var q = search.value.trim().toLowerCase();
          var shown = data.filter(function (d) {
            return !q || Object.keys(d).map(function (k) { return d[k]; }).join(" ").toLowerCase().indexOf(q) !== -1;
          });
          count.textContent = "Showing " + shown.length + " of " + data.length + " examples";
          list.innerHTML = "";
          var grid = el("div", { "class": "cards" });
          shown.forEach(function (d) {
            var tags = el("div", { "class": "tags" });
            split(d.approaches).forEach(function (s) { tags.appendChild(el("span", { "class": "tag" }, [s])); });
            split(d.frameworks_used).filter(function (x) { return x !== "None"; })
              .forEach(function (s) { tags.appendChild(el("span", { "class": "tag dept" }, [s])); });
            grid.appendChild(el("article", { "class": "card-item" }, [
              el("h3", {}, [titleNode(d.title, d.link)]),
              el("p", { "class": "publisher" }, [[d.department, d.what_shared].filter(Boolean).join(" · ")]),
              d.lesson ? el("p", { "class": "desc" }, [d.lesson]) : null,
              d.community_partners ? el("p", { "class": "desc" }, [el("strong", {}, ["Worked with: "]), d.community_partners]) : null,
              tags
            ]));
          });
          list.appendChild(grid);
        }
        search.addEventListener("input", render);
        render();
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var r = document.getElementById("resources-app");
    if (r) initResources(r);
    var e = document.getElementById("examples-app");
    if (e) initExamples(e);
  });
})();
