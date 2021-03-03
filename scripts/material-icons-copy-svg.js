// ==UserScript==
// @name         Adds copy button to Material Icons - https://material.io/resources/icons and https://fonts.google.com/icons
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/nt4f04uNd/tampermonkey-scripts
// @version      0.2
// @description  Creates a button to instantly copy material icon SVG to clipboard
// @author       nt4f04und
// @include      https://material.io/resources/icons*
// @include      https://fonts.google.com/icons*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ghost = document.createElement('div')
    ghost.style = 'display:none'

    const gfonts = document.URL.includes('fonts.google.com/icons')
    const buttonRowClass = gfonts ? '.side-nav-links__download-buttons' : '.asset-selection--buttons'

    function getClickElement() {
        return document.querySelector(gfonts ? 'mat-sidenav-content' : 'mat-drawer-content');
    }

    function register(clickElement) {
        clickElement.addEventListener('click', () => {
            createCopyBtn()
        }, {catch: 'true'})

        createCopyBtn()

        function createCopyBtn() {
            if (!document.querySelector('#copy-btn')) {
                const buttonRow = document.querySelector(buttonRowClass)
                if (!buttonRow)
                    return;
                const downloadSvgBtn = buttonRow.querySelector('a')
                if (!downloadSvgBtn)
                    return;
                const copyBtn = downloadSvgBtn.cloneNode()
                copyBtn.id = 'copy-btn'
                copyBtn.innerHTML = downloadSvgBtn.innerHTML
                copyBtn.removeAttribute('download')
                copyBtn.setAttribute('href', '#')
                buttonRow.appendChild(copyBtn)
                // change icon
                if (gfonts) {
                    copyBtn.querySelector('svg').innerHTML = '<path _ngcontent-ktk-c9="" clip-rule="evenodd" d="M 7.5 10 L 2.5 10 L 2.5 3.5 C 2.5 3.226562 2.273438 3 2 3 C 1.726562 3 1.5 3.226562 1.5 3.5 L 1.5 10 C 1.5 10.550781 1.949219 11 2.5 11 L 7.5 11 C 7.773438 11 8 10.773438 8 10.5 C 8 10.226562 7.773438 10 7.5 10 Z M 10 8 L 10 2 C 10 1.449219 9.550781 1 9 1 L 4.5 1 C 3.949219 1 3.5 1.449219 3.5 2 L 3.5 8 C 3.5 8.550781 3.949219 9 4.5 9 L 9 9 C 9.550781 9 10 8.550781 10 8 Z M 9 8 L 4.5 8 L 4.5 2 L 9 2 Z M 9 8 " fill-rule="evenodd"></path>'
                    copyBtn.style.marginLeft = '8px'
                } else {
                    copyBtn.querySelector('.mat-icon').innerHTML = 'content_copy'
                }
                copyBtn.addEventListener('click', async (e) => {
                    e.preventDefault()
                    const downloadStrip = "?download=true"
                    let url = downloadSvgBtn.getAttribute('href');
                    if (!gfonts)
                        url = url.slice(0, -downloadStrip.length);
                    const res = await fetch(url)
                    ghost.innerHTML = await res.text()
                    const paths = ghost.querySelectorAll('path')
                    if (paths.length > 1)
                        paths[0].remove()
                    await navigator.clipboard.writeText(ghost.innerHTML)
                    console.log('COPIED')
                })
            }
        }
    }

    if (gfonts) {
        let registered = false;
        const observer = new MutationObserver(function (mutationRecords) {
            if (registered)
                return;
            const clickElement = getClickElement()
            if (clickElement) {
                register(clickElement)
                registered = true
            }
        });
        observer.observe(document.body, {childList: true});
    } else {
        register(getClickElement())
    }
})();