const statuses=["Reported","Reviewed","In Progress","Resolved"];


document.addEventListener("DOMContentLoaded",()=>{
 loadIssues();
 const page=document.body.dataset.page;
 if(page==="dashboard") initDashboard();
 if(page==="report") initReport();
 if(page==="issues") initIssues();
 if(page==="detail") initDetail();
 if(page==="mine") initMine();
});

function issues()
{
  return loadIssues();
}
function moneyDate(d)
{
  return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function esc(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function badgeClass(v){
  return v.toLowerCase().replace(/[^a-z]+/g,"-");
}
function issueCard(x){
 
  return `<article class="issue-card">
   
  <div class="card-top"><span class="issue-id">${x.id}</span><span class="badge ${badgeClass(x.priority)}">${esc(x.priority)}</span></div>
   <h3>${esc(x.title)}</h3>
   <p class="muted">${esc(x.category)} • ${esc(x.hostel)} • Room ${esc(x.room)}</p>
   <p class="desc">${esc(x.description)}</p>
   <div class="card-bottom"><span class="status ${badgeClass(x.status)}">${esc(x.status)}</span><a href="issue.html?id=${encodeURIComponent(x.id)}">View details →</a></div>
 </article>`;
}
function initDashboard(){
 const all=issues();
 const stats=[
  ["Total Issues",all.length,"total"],["Pending",all.filter(x=>x.status==="Reported"||x.status==="Reviewed").length,"pending"],
  ["In Progress",all.filter(x=>x.status==="In Progress").length,"progress"],["Resolved",all.filter(x=>x.status==="Resolved").length,"resolved"],
  ["High Priority",all.filter(x=>x.priority==="High"&&x.status!=="Resolved").length,"high"]
 ];
 document.getElementById("stats").innerHTML=stats.map(s=>`<div class="stat-card"><span>${s[0]}</span><strong>${s[1]}</strong><small>${s[0]==="Resolved"?"Completed issues":"Current count"}</small></div>`).join("");
 document.getElementById("recentIssues").innerHTML=[...all].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map(issueCard).join("");
}
function initReport(){
 document.getElementById("issueDate").value=new Date().toISOString().slice(0,10);
 document.getElementById("issueForm").addEventListener("submit",e=>{
  e.preventDefault(); const fd=new FormData(e.target);
   const all=issues();
  const num=1001+all.length; 
  const x={id:"ISS-"+num,title:fd.get("title"),category:fd.get("category"),hostel:fd.get("hostel"),room:fd.get("room"),priority:fd.get("priority"),date:fd.get("date"),description:fd.get("description"),status:"Reported",mine:true,resolution:""};
 
  all.unshift(x); saveIssues(all); 
  
  alert(`Issue ${x.id} has been reported successfully.`);
 
  location.href="issue.html?id="+x.id;
 });
}
function initIssues(){
 const params=new URLSearchParams(location.search); document.getElementById("issueSearch").value=params.get("search")||"";
 ["issueSearch","categoryFilter","statusFilter","priorityFilter","sortFilter"].forEach(id=>document.getElementById(id).addEventListener("input",renderIssues));
 renderIssues();
}
function renderIssues(){
 let all=[...issues()], q=document.getElementById("issueSearch").value.toLowerCase(), c=document.getElementById("categoryFilter").value,s=document.getElementById("statusFilter").value,p=document.getElementById("priorityFilter").value;
 all=all.filter(x=>(!q||`${x.id} ${x.title} ${x.room} ${x.description}`.toLowerCase().includes(q))&&(!c||x.category===c)&&(!s||x.status===s)&&(!p||x.priority===p));
 all.sort((a,b)=>document.getElementById("sortFilter").value==="oldest"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
 document.getElementById("issueList").innerHTML=all.length?all.map(issueCard).join(""):`<div class="empty"><strong>No issues found</strong><p>Try changing your search or filters.</p></div>`;
}
function initDetail(){
 const id=new URLSearchParams(location.search).get("id"), x=issues().find(i=>i.id===id);
 const el=document.getElementById("issueDetail");
 if(!x){
  el.innerHTML=`<div class="empty"><h2>Issue not found</h2><a class="btn primary" href="issues.html">Back to issues</a></div>`;
  return;
}
 el.innerHTML=`<a class="back" href="issues.html">← Back to issues</a>
 <section class="detail-card">
 
 <div class="detail-head"><div><span class="issue-id">${x.id}</span><h1>${esc(x.title)}</h1></div><span class="badge ${badgeClass(x.priority)}">${esc(x.priority)} priority</span></div>
  
  <div class="detail-meta"><div><small>Category</small><strong>${esc(x.category)}</strong></
  
  div><div><small>Location</small><strong>${esc(x.hostel)} • ${esc(x.room)}</strong></
  
  div><div><small>Reported</small><strong>${moneyDate(x.date)}</strong></div></div>
  
  <div class="description-box"><small>Description</small><p>${esc(x.description)}</p></div>
  
  <h2>Issue timeline</h2>
 
  <div class="timeline">${statuses.map((s,i)=>{const cur=statuses.indexOf(x.status);return `<div class="timeline-item ${i<=cur?"done":""} ${i===cur?"current":""}"><span>${i<cur?"✓":i===cur?"●":"○"}</span><div><strong>${s}</strong><small>${i===0?moneyDate(x.date):i<=cur?"Status updated":"Waiting for update"}</small></div></div>`}).join("")}
  </div>
 
  ${x.status==="Resolved"&&x.resolution?`<div class="resolution"><strong>Resolution note</strong><p>${esc(x.resolution)}</p></div>`:""}
  
  <div class="admin-actions"><button class="btn secondary" onclick="advanceStatus('${x.id}')">${x.status==="Resolved"?"Issue Resolved":"Update Status"}</button><button class="btn danger" onclick="deleteIssue('${x.id}')">Delete</button></div>
 </section>`;
}
function advanceStatus(id){
 const all=issues(),x=all.find(i=>i.id===id),idx=statuses.indexOf(x.status);

 if(idx<statuses.length-1){
  x.status=statuses[idx+1];
  if(x.status==="Resolved")x.resolution="Maintenance team marked this issue as resolved.";saveIssues(all);initDetail();
}
 else alert("This issue is already resolved.");
}

function deleteIssue(id){
  if(confirm("Delete this issue?")){saveIssues(issues().filter(x=>x.id!==id));
    location.href="issues.html";}
}

function initMine(){
  document.getElementById("myIssues").innerHTML=issues().filter(x=>x.mine).map(issueCard).join("")||`<div class="empty"><strong>No reports yet</strong><p>Report an issue to see it here.</p></div>`;
}

function globalSearch(e){
  e.preventDefault();const q=document.getElementById("globalSearch").value.trim();if(q)location.href="issues.html?search="+encodeURIComponent(q);else location.href="issues.html";
}
