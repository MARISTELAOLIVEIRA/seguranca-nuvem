"use strict";(globalThis.webpackChunk_genially_view_client=globalThis.webpackChunk_genially_view_client||[]).push([[7801],{47801(e,t,n){n.d(t,{geniallyFindThePairViewScript:()=>Y});var i=n(45992),r=n(10285),o=n(84054),a=n(60708),s=n(41381),l=n(1436),d=n(17588),u=n(37577),c=n(46990),m=n(56393);const p=1e3,g=294.11764705882354,f=u.Ay.div({display:"flex",justifyContent:"center",alignItems:"center",flexShrink:0,position:"absolute",paddingLeft:"12px",paddingRight:"12px",bottom:0,left:0,userSelect:"none",minHeight:"25%",top:"75%",width:"100%",backgroundColor:"rgba(18,18,18,0.5)"}),h=u.Ay.p({color:"white",fontSize:12,textAlign:"center",fontStyle:"normal",fontWeight:400,lineHeight:"16px",overflow:"hidden",textOverflow:"ellipsis",wordWrap:"break-word",whiteSpace:"nowrap",pointerEvents:"none"}),v=u.Ay.div`
  @keyframes rotate-out {
    0% {
      transform: rotateY(0deg);
    }
    33% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes rotate-in {
    0% {
      transform: rotateY(0deg);
    }
    33% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    12% {
      transform: scale(1.05, 1.05);
    }
    40% {
      transform: scale(1.05, 1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  container-type: size;

  cursor: ${e=>{let{$flipped:t,$burned:n}=e;return t||n?"default":"pointer"}};

  animation-name: ${e=>{let{$flipped:t}=e;return t?"rotate-out":"rotate-in"}}
    ${e=>{let{$burned:t}=e;return t?",pulse":""}};
  animation-duration: ${p}ms;
  animation-delay: 0ms, ${p}ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-out, ease-in-out;
  perspective: 1500px;

  border-radius: 9%;
  @supports (container-type: size) {
    border-radius: 6cqmin;
  }

  /* HACK: We need to set border as important because .genially-embed is reseting our borders in the View */
  border: 1px solid
    ${e=>{let{theme:t,$flipped:n}=e;return n?t.color.border.primary.disabled():t.color.border.primary.default()}} !important;
  outline: 1px white solid;

  filter: ${e=>{let{$flipped:t}=e;return t?"":"drop-shadow(0px 1px 4px rgba(0, 15, 51, 0.2))"}};

  &:hover {
    filter: ${e=>{let{$flipped:t}=e;return t?"":"drop-shadow(rgba(0, 15, 51, 0.3) 0px 1px 8px)"}};
    border-color: ${e=>{let{theme:t,$flipped:n}=e;return n?t.color.border.primary.disabled():t.color.border.primary.hover()}} !important;
  }

  ${f} {
    visibility: ${e=>{let{$flipped:t}=e;return t?"initial":"hidden"}};
    transition: visibility ${g}ms steps(1);
    z-index: 1;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    opacity: ${e=>{let{$burned:t}=e;return t?"0.4":"0"}};
    transition: opacity ${p}ms steps(1);
    transition-delay: ${p}ms;
    background-color: white;
    pointer-events: none;
  }
`,b=e=>{let{title:t,frontImageSrc:n,coverImageSrc:r,fitImages:o,flipped:a,burned:s,onClick:l}=e;const d=Boolean(s),u=Boolean(a);return(0,i.jsxs)(v,{role:"button",$burned:d,$flipped:u,onClick:e=>{e.stopPropagation(),l&&l()},"aria-label":`Card showing ${u?"front":"back"} side with title: ${t}`,"aria-disabled":d,tabIndex:d?-1:0,children:[(0,i.jsx)("img",{style:{opacity:u?1:0,position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:o?"contain":"cover",transition:"opacity 294.11764705882354ms steps(1)"},src:n,alt:"front"}),(0,i.jsx)("img",{style:{opacity:u?0:1,position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:o?"contain":"cover",transition:"opacity 294.11764705882354ms steps(1)"},src:r,alt:"cover"}),t&&(0,i.jsx)(f,{hidden:!u,children:(0,i.jsx)(m.A,{text:t,placement:m.A.Position.TOP,fallbackPlacements:[m.A.Position.TOP],renderReferencePortalNode:document.querySelector("body"),children:(0,i.jsx)(h,{"data-testid":"card-title",children:t})})})]})};var y=n(40671),w=n(99049);const S=e=>{if("auto"===e)return;const t=Number(e);if(!Number.isNaN(t))return t;console.warn("Cannot parse row distribution. Setting to auto",e)},I=(e,t)=>t?((e,t)=>e<t?{numColumns:1,numRows:e}:{numColumns:Math.ceil(e/t),numRows:t})(e,t):(e=>{if(e<4)return{numColumns:1,numRows:e};let t=4;for(;e%t!==0&&t<7;)t+=1;return{numColumns:t,numRows:Math.ceil(e/t)}})(e),E=u.Ay.div`
  container-type: size;
  height: 100%;
  padding: 8px;
`,x=u.Ay.div`
  --contained-gap: 16px;

  display: grid;
  grid-template-columns: repeat(${e=>e.numColumns}, minmax(0, 1fr));
  grid-template-rows: repeat(${e=>e.numRows}, 1fr);
  grid-auto-flow: column;
  height: 100%;
  gap: var(--contained-gap);

  @supports (container-type: size) {
    --contained-gap: 4cqmin;
  }
`,C=(u.Ay.canvas({width:"100%",height:"100%",pointerEvents:"none",position:"absolute",top:0,left:0,zIndex:3}),e=>{let{items:t,renderItem:n,keyExtractor:r,getComputedStyles:o,forcedRows:a}=e;const s=I(t.length,a);return(0,i.jsx)(E,{children:(0,i.jsx)(x,{numColumns:s.numColumns,numRows:s.numRows,children:(0,i.jsx)(y.N,{children:t.map(((e,t)=>(0,i.jsx)(w.P.div,{layout:!0,style:o?o(e,t):void 0,initial:{opacity:0,scale:.7},animate:{opacity:1,scale:1},transition:{type:"spring",ease:"easeInOut",stiffness:30,damping:10},"data-testid":`grid-item-${r(e)}`,children:n(e)},r(e))))})})})});var A=n(50414),N=n(76814);var j;!function(e){e.FACEDOWN="faceDown",e.FACEUP="faceUp",e.BURNED="burned"}(j||(j={}));const F=e=>e.replace("-original","-pair"),O=(e,t)=>{const n=e%2===1,i=t%2===1;return n&&!i?1:!n&&i?-1:e-t},$=e=>{let{theme:t,images:n,coverImageSrc:r,fitImages:o,rowsDitributionFromConfig:a,onSuccess:s,onFailure:l,onGameWon:m,onFaceUp:g,shuffleSeed:f,presentationRecording:h}=e;const{shuffledCards:v,isFaceUp:y,isBurned:w,onPick:S,recordingState:I,applyRecordingState:E}=((e,t,n,i,r,o)=>{const a=(0,d.useMemo)((()=>{const t=e.map((e=>{return Object.assign(Object.assign({},e),{id:e.id,pairId:e.id.includes("-pair")?(t=e.id,t.replace("-pair","-original")):F(e.id)});var t}));return void 0===o?(0,A.U)(t):(0,N.y)(t,(0,N.s)(o))}),[e,o]),s=e=>{const t=new Map;return a.forEach(((n,i)=>{t.set(n.id,{id:n.id,status:e(i),pairId:n.pairId})})),t},[l,u]=(0,d.useState)((()=>s((()=>j.FACEDOWN)))),c=(0,d.useCallback)((e=>{var t;return(null===(t=l.get(e))||void 0===t?void 0:t.status)===j.FACEUP}),[l]),m=(0,d.useCallback)((e=>{var t;return(null===(t=l.get(e))||void 0===t?void 0:t.status)===j.BURNED}),[l]),p=e=>a.flatMap(((t,n)=>{var i;return(null===(i=l.get(t.id))||void 0===i?void 0:i.status)===e?[n]:[]})),g={faceUp:p(j.FACEUP),burned:p(j.BURNED)};return{shuffledCards:a,isFaceUp:c,isBurned:m,onPick:e=>{const o=l.get(e);if(o.status!==j.FACEDOWN)return;const a=[...l.values()].filter((e=>e.status===j.FACEUP));if(0===a.length)l.set(o.id,Object.assign(Object.assign({},o),{status:j.FACEUP}));else if(1===a.length){const e=a[0];e.pairId===o.id?(l.set(e.id,Object.assign(Object.assign({},e),{status:j.BURNED})),l.set(o.id,Object.assign(Object.assign({},o),{status:j.BURNED})),t()):(l.set(o.id,Object.assign(Object.assign({},o),{status:j.FACEUP})),n())}else 2===a.length&&(a.forEach((e=>{l.set(e.id,Object.assign(Object.assign({},e),{status:j.FACEDOWN}))})),l.set(o.id,Object.assign(Object.assign({},o),{status:j.FACEUP})));r(o.id),u(new Map(l)),[...l.values()].every((e=>e.status===j.BURNED))&&i()},recordingState:g,applyRecordingState:e=>{var t,n;const i=new Set(null!==(t=null===e||void 0===e?void 0:e.faceUp)&&void 0!==t?t:[]),r=new Set(null!==(n=null===e||void 0===e?void 0:e.burned)&&void 0!==n?n:[]);u(s((e=>r.has(e)?j.BURNED:i.has(e)?j.FACEUP:j.FACEDOWN)))}}})(n,(()=>{setTimeout((()=>{s()}),p)}),(()=>{setTimeout((()=>{l()}),p)}),(()=>{setTimeout((()=>{m()}),p)}),(e=>{g(e)}),f);(0,c.M)(h,I,E);const[x,$]=(0,d.useState)((()=>Array.from({length:v.length},((e,t)=>t))));return(0,d.useEffect)((()=>{$((e=>[...e].sort(O).reverse()))}),[]),(0,i.jsx)(u.NP,{theme:t,children:(0,i.jsx)(C,{items:v,forcedRows:a,renderItem:e=>(0,i.jsx)(b,{title:e.title,frontImageSrc:e.src,coverImageSrc:r,fitImages:o,flipped:y(e.id)||w(e.id),burned:w(e.id),onClick:()=>{return t=e.id,null===h||void 0===h||h.markGesture(),void S(t);var t}}),keyExtractor:e=>e.id,getComputedStyles:(e,t)=>({order:x[t]})})})};var P=n(43495);const R=e=>{let{theme:t,pairedImages:n,fitImages:r,forwardSetFlipped:o,coverImageSrc:a,rowsDitributionFromConfig:s}=e;const[l,c]=(0,d.useState)(!1);return(0,d.useEffect)((()=>{o(c)}),[o]),(0,i.jsx)(u.NP,{theme:t,children:(0,i.jsx)(C,{items:n,forcedRows:s,renderItem:e=>(0,i.jsx)(b,{title:e.title,frontImageSrc:e.src,coverImageSrc:a,fitImages:r,flipped:l}),keyExtractor:e=>e.id,getComputedStyles:()=>({pointerEvents:"none"})})})},T=e=>{let{pairedImages:t,coverImageSrc:n,fitImages:r,rowsDitributionFromConfig:o}=e;return(0,i.jsx)(R,{theme:P.A.themes.newPrimary,pairedImages:t,coverImageSrc:n,fitImages:r,forwardSetFlipped:()=>{},rowsDitributionFromConfig:o})};var k=n(54072);const U=e=>null!==e,D=e=>{if(e&&"action"in e){const{action:t}=e;return t&&"source"in t&&t.source?t.source:""}if(e&&"data"in e){const{data:t}=e;return t&&"source"in t&&t.source?t.source:""}return""},M=(e,t)=>{var n;const i=null===(n=e.image)||void 0===n?void 0:n.source,r=D(e.audio);return i?{id:t,src:i,title:e.title,altText:e.image.altText||"",audioSource:r}:null},B=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return e.flatMap((e=>{const n=(0,k.Ak)(),i=M(e,`${n}-original`),r=t?M(e,`${n}-pair`):((e,t)=>{var n,i;const r=null===(n=e.imagePair)||void 0===n?void 0:n.source;if(!r)return null;const o=D(e.audioPair);return{id:t,src:r,title:e.titlePair||e.title,altText:(null===(i=e.imagePair)||void 0===i?void 0:i.altText)||"",audioSource:o}})(e,`${n}-pair`);return[i,r]})).filter(U)},W="https://audios.genial.ly/59e059d30b9c21060cb4c2ec/de8b3efe-c4df-48ff-8bbb-2b3e940663d3.wav",z="https://audios.genial.ly/59e059d30b9c21060cb4c2ec/23fe908b-44e2-4972-981f-d857c429b126.wav",Y=(e,t)=>{var n;e.slide.audioRequirement=o.w.ShowMute;const d=e.config.itemList,u=B(d,e.config.identicalImages),c=(0,l.k)({widgetItem:e.item,view:t}),m=t.hasPresentationRecordingDeterministicOrder?null===(n=e.item)||void 0===n?void 0:n.id:void 0;(0,s.p)({getTargetNodeItem:()=>e.item,initialState:{hasSlideEntered:!1},renderApp:n=>{let{setState:o}=n;var s;const{coverImage:l,fitImages:d,numRows:p,onEndAction:g}=e.config,f=e.item;t.preloadAudio(W),t.preloadAudio(z),u.forEach((e=>{t.preloadAudio(e.audioSource)}));const h=()=>{t.playAudio({source:W})},v=()=>{t.playAudio({source:z})},b=()=>{null===g||void 0===g||g.run()};return null===(s=null===f||void 0===f?void 0:f.parentSlide)||void 0===s||s.on(a.m.Entered,(()=>{o({hasSlideEntered:!0})})),e=>{let{hasSlideEntered:n=!1}=e;if(!n)return(0,i.jsx)(i.Fragment,{});const o=[];return(0,i.jsx)($,{theme:t.theme,images:u,coverImageSrc:String(l.source),fitImages:d,rowsDitributionFromConfig:S(p),onSuccess:h,onFailure:v,onGameWon:b,onFaceUp:e=>{const n=u.find((t=>t.id===e));if(!n||!n.audioSource)return;o.forEach((e=>{t.playAudio(Object.assign(Object.assign({},e),{playMode:r.F.Stop}))})),o.length=0;const i={source:n.audioSource,playMode:r.F.PlayRestart},a=t.playAudio(i);o.push(Object.assign(Object.assign({},i),{refId:a.refId}))},shuffleSeed:m,presentationRecording:c})}},renderThumbnailApp:()=>{const{coverImage:t,fitImages:n,numRows:r}=e.config;return(0,i.jsx)(T,{pairedImages:u,coverImageSrc:String(t.source),fitImages:n,rowsDitributionFromConfig:S(r)})}})(e,t)}},41381(e,t,n){n.d(t,{p:()=>a});var i=n(70377),r=n(66264),o=n(60708);function a(e){let{getTargetNodeItem:t,renderApp:n,renderThumbnailApp:a,initialState:s}=e,l=!1;const d=[],u=e=>{d.push(e)};return e=>{const c=t(e.config),m=null===c||void 0===c?void 0:c.parentSlide;function p(){l=!1,d.forEach((e=>{e()})),d.length=0}function g(){if(!c)return;let e=null;if("idOfFreeNode"in c)e=document.getElementById(c.idOfFreeNode);else{const t=document.createElement("div");t.innerHTML=c.source;let n=t.getElementsByClassName("genially-widget-app");n.length||(n=t.getElementsByClassName("genially-widget-gallery"));const{id:i}=n[0];if(!i)return;e=document.getElementById(i)}if(e){let t;const r=n=>{l&&t?i.render(t(n),e):console.warn('"rerender" was called when the widget was already unmounted. This is a no-op. Did you forget to dispose of an event handler with "onUnmount"?')};t=n({setState:r,onUnmount:u,unmountNow:p}),l=!0,r(s),d.push((()=>{i.unmountComponentAtNode(e)}))}}function f(){if(!c||!("idOfThumbnailFreeNode"in c))return[];const e=document.getElementsByClassName(c.idOfThumbnailFreeNode);return Array.from(e).filter((e=>e instanceof HTMLElement))}const h=c&&"isTransversal"in c&&c.isTransversal,v=()=>{null===c||void 0===c||c.on(r.q.Mount,(()=>{g()})),null===c||void 0===c||c.on(r.q.Unmount,(()=>{p()}))};h?v():(null===m||void 0===m||m.on(o.m.Entering,(()=>{l||(g(),l||v())})),null===m||void 0===m||m.on(o.m.Exited,(()=>{l&&p()}))),null===m||void 0===m||m.on(o.m.ThumbnailMount,(()=>{!function(){if(!a||!c||!("idOfThumbnailFreeNode"in c))return;f().forEach((e=>{i.unmountComponentAtNode(e)}))}(),function(){if(!a||!c||!("idOfThumbnailFreeNode"in c))return;f().forEach((e=>{const{renderingSlideId:t}=e.dataset;i.render(a({renderingSlideId:t}),e)}))}()}))}}},1436(e,t,n){n.d(t,{k:()=>r});var i=n(66264);const r=e=>{let{widgetItem:t,view:n}=e;const r=(e=>{let{record:t,now:n=Date.now}=e,i=Number.NEGATIVE_INFINITY,r=null,o=null;const a=new Set;return{markGesture(){i=n()},recordIfGesture(e){const o=JSON.stringify(e),a=o!==r;r=o,!a||n()-i>1e3||t(e)},see(e){r=JSON.stringify(e)},receive(e){i=Number.NEGATIVE_INFINITY,0!==a.size?a.forEach((t=>t(e))):o=null===e?null:{state:e}},subscribe(e){if(a.add(e),o){const{state:t}=o;o=null,e(t)}return()=>{a.delete(e)}}}})({record:e=>n.recordPresentationRecordingWidgetState(e)});return null===t||void 0===t||t.on(i.q.PresentationRecordingWidgetState,(e=>r.receive(e))),r}},76814(e,t,n){n.d(t,{s:()=>i,y:()=>r});const i=e=>{let t=(e=>{let t=5381;for(let n=0;n<e.length;n+=1)t=33*t^e.charCodeAt(n);return t>>>0})(e);return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}},r=(e,t)=>{const n=[...e];for(let i=n.length-1;i>0;i-=1){const e=Math.floor(t()*(i+1));[n[i],n[e]]=[n[e],n[i]]}return n}}}]);
//# sourceMappingURL=https://s3-static-genially.genially.com/view/static/js/7801.f6d1b234.chunk.js.map