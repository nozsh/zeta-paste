document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".navbar"),e=t?t.offsetHeight:0,o=(t,o="smooth")=>{let n=document.querySelector(t);if(n){let t=n.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:t-e,behavior:o})}},n=t=>{let e=t.target;if(e&&e.hash){t.preventDefault();let n=e.hash;history.pushState(null,"",n),o(n)}},l=()=>{window.location.hash&&o(window.location.hash)};if(document.querySelectorAll('a[href^="#"]').forEach(t=>t.addEventListener("click",n)),window.addEventListener("hashchange",l),window.addEventListener("load",l),window.location.hash){let t=window.location.hash;history.replaceState(null,""," "),setTimeout(()=>{history.replaceState(null,"",t),o(t,"instant")},0)}window.addEventListener("scroll",()=>{let t=document.querySelectorAll('a[href^="#"]'),o=new Set;t.forEach(t=>{let e=t.getAttribute("href");e&&e.startsWith("#")&&o.add(e.substring(1))});let n="";o.forEach(t=>{let o=document.getElementById(t);if(o){let l=o.getBoundingClientRect();l.top<=e&&l.bottom>=e&&(n=`#${t}`)}}),n&&window.location.hash!==n&&history.replaceState(null,"",n)})});