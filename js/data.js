const DEMO_ISSUES = [
 {id:"ISS-1001",title:"Broken ceiling fan",category:"Electrical",hostel:"Block B",room:"B-204",priority:"High",date:"2026-09-28",description:"The ceiling fan is not working and makes a loud noise.",status:"In Progress",mine:true,resolution:""},
 {id:"ISS-1002",title:"Water leakage near washroom",category:"Plumbing",hostel:"Block A",room:"A-108",priority:"High",date:"2026-09-27",description:"Water is leaking near the washroom entrance.",status:"Reviewed",mine:false,resolution:""},
 {id:"ISS-1003",title:"Room cleaning required",category:"Cleaning",hostel:"Block C",room:"C-312",priority:"Medium",date:"2026-09-26",description:"Room corridor and common area need cleaning.",status:"Resolved",mine:true,resolution:"Cleaning staff completed the work on 2026-09-27."},
 {id:"ISS-1004",title:"Loose study table",category:"Furniture",hostel:"Block B",room:"B-117",priority:"Low",date:"2026-09-25",description:"The study table is unstable and one leg is loose.",status:"Reported",mine:false,resolution:""},
 {id:"ISS-1005",title:"Wi-Fi connection issue",category:"Internet/Wi-Fi",hostel:"Block A",room:"A-221",priority:"Medium",date:"2026-09-24",description:"Internet connection frequently disconnects in the room.",status:"In Progress",mine:true,resolution:""}
];

function loadIssues(){
 const saved=JSON.parse(localStorage.getItem("hostelIssues")||"null");
 if(!saved){ localStorage.setItem("hostelIssues",JSON.stringify(DEMO_ISSUES)); return DEMO_ISSUES; }
 return saved;
}
function saveIssues(items){localStorage.setItem("hostelIssues",JSON.stringify(items));}
