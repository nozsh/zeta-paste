const e=document.getElementById("logo"),t=document.getElementById("idk_modal"),d=document.getElementById("idk_img");let c=0,n=0;e&&t&&d&&(e.addEventListener("click",()=>{let e=new Date().getTime();e-n>5e3&&(c=0,n=e),1==++c&&(n=e),c>=10&&(t.checked=!0,c=0)}),d.addEventListener("click",()=>{t.checked=!1}));