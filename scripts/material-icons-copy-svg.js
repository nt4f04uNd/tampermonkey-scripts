// ==UserScript==
// @name         Add copy button to Material Icons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Besides two download buttons in the sidebar, also creates a button to instantly copy the icon SVG
// @author       nt4f04und
// @include      https://material.io/resources/icons/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ghost = document.createElement('div')
    ghost.style = 'display:none'
    createCopyBtn()
    document.querySelectorAll('icons-item').forEach(icon => {
        icon.addEventListener('click', () => {
            createCopyBtn()
        })
    })

    function createCopyBtn() {
        if (!document.querySelector('#copy-btn')) {
            const downloadSvgBtn = document.querySelector('.asset-selection-link')
            const copyBtn = downloadSvgBtn.cloneNode()
            copyBtn.id = 'copy-btn'
            copyBtn.innerHTML = downloadSvgBtn.innerHTML
            copyBtn.removeAttribute('download')
            copyBtn.setAttribute('href', '#')
            document.querySelector('.asset-selection--buttons').appendChild(copyBtn)
            copyBtn.querySelector('.mat-icon').innerHTML = 'content_copy'
            copyBtn.addEventListener('click', async (e) => {
                e.preventDefault()
                const downloadStrip = "?download=true"
                const res = await fetch(downloadSvgBtn.getAttribute('href').slice(0, -downloadStrip.length))
                ghost.innerHTML = await res.text()
                const paths = ghost.querySelectorAll('path')
                if (paths.length > 1)
                    paths[0].remove()
                await navigator.clipboard.writeText(ghost.innerHTML)
                console.log('COPIED')
            })
        }
    }
})();
