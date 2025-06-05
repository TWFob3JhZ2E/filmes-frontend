(function(){
  document.addEventListener("contextmenu",e=>e.preventDefault());
  document.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if(e.key==="F12"||(e.ctrlKey&&e.shiftKey&&(k==="i"||k==="j"||k==="c"))||(e.ctrlKey&&k==="u")){
      e.preventDefault();
    }
  });
  let bloqueado=false;
  setInterval(function(){
    let t1=new Date().getTime();
    debugger;
    let t2=new Date().getTime();
    if(!bloqueado&&t2-t1>100){
      bloqueado=true;
      document.body.innerHTML="";
      document.documentElement.innerHTML="";
      window.location.href="http://www.google.com/";
    }
  },1000);
})();
