import './style.css';
import projectData from './Projects_Data.json';
import profData from './UpdatedProfData.json'

const appElement = document.querySelector('#app');
const tableRows = projectData.map((project, index) => {
    const investigatorNames = Object.keys(project.Investigators).map(key => `<p class="investigator-name">${key}</p>`);
    const investigatorDepartments = Object.keys(project.Investigators).map(key => `<p class="investigator-info">${project.Investigators[key].Department}</p>`);
    const investigatorCampuses = Object.keys(project.Investigators).map(key => `<p class="investigator-info">${project.Investigators[key].Campus}</p>`);
    return `<tr>
                <td class="table-basic-div" style="width: 20px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}">${project.Sno}</td>
                <td class="table-basic-div" style="width: 120px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}">${project.Application_No}</td>
                <td class="table-basic-div" style="width: 485px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}">${project.Project_Title}</td>
                <td style="width: 180px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}"><div class="table-content-div">${investigatorNames.join('')}</div></td>
                <td style="width: 220px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}"><div class="table-content-div">${investigatorDepartments.join('')}</div></td>
                <td style="width: 120px; background-color: ${index % 2 !== 0 ? '#f0f0f0' : '#fff'}"><div class="table-content-div">${investigatorCampuses.join('')}</div></td>
            </tr>`;
});

appElement.innerHTML = `
  <div>
    <h2>Projects accepted for funding under 1st Call for Proposal under</h2>
    <h2>Cross Disciplinary Research Framework (CDRF)</h2>
    <table>
        <tr>
            <th class="table-header" style="width: 20px">#</th>
            <th class="table-header" style="width: 120px;">Application No.</th>
            <th class="table-header" style="width: 485px;">Project Title</th>
            <th class="table-header" style="width: 180px;">Name of Investigator</th>
            <th class="table-header" style="width: 220px;">Department of Investigator</th>
            <th class="table-header" style="width: 120px;">Campus of Investigator</th>
        </tr>
        ${tableRows.join('')}
    </table>
  </div>
`;

// Adding event listeners to investigator-info elements for popover
const investigatorInfoElements = document.querySelectorAll('.investigator-name');
investigatorInfoElements.forEach((element, index) => {
    let profName = element.innerText;
    let collaborationsData = createCollaborations();

    const collaborationsProfiles = collaborationsData[profName]?.collaborations.map(collabProf => `<div style="margin-top: 12px; width: max-content">
        <p style="font-weight: 600; margin: 0">${collabProf} <span style="font-size: 12px; color: #919191">(${profData[collabProf]?.department} - ${profData[collabProf]?.campus})</span></p>
        <a style="margin-top: 16px; font-size: 12px" href="${profData[collabProf]?.url}" target="_blank">Website</a>
    </div>`)

    element.addEventListener('mouseover', () => {
        const otherPopovers = document.querySelector('.popover');
        if (otherPopovers) {
            otherPopovers.remove();
        }

        const popover = document.createElement('div');
        const closeIcon = document.createElement('img');
        closeIcon.src = '/close.png';
        closeIcon.alt = 'close';
        closeIcon.classList.add('close-icon');

        closeIcon.addEventListener('click', () => {
            popover.remove();
        })

        popover.classList.add('popover');
        popover.id = profName + index;
        // You can add custom content to the popover here
        popover.innerHTML = `<div>
                                <div style="margin-bottom: 32px">
                                    <p style="font-weight: 600; margin-top: 0; margin-bottom: 16px">Website Link:-</p>
                                    <p style="font-weight: 600; margin: 0">${profName} <span style="font-size: 12px; color: #919191">(${profData[profName]?.department} - ${profData[profName]?.campus})</span></p>
                                    <a style="margin-top: 16px; font-size: 12px" href="${profData[profName]?.url}" target="_blank">Website</a>
                                </div>
                                <p style="font-weight: 600; margin-top: 0; margin-bottom: 16px">Collaborations :-</p>
                                ${collaborationsProfiles.join('')}
                             </div>`;
        // Position the popover relative to the hovered element and consider scroll position
        const rect = element.getBoundingClientRect();
        let existingPopover = document.getElementById(profName + index);
        if (!existingPopover) {
            document.body.appendChild(popover);
            popover.appendChild(closeIcon);
        }
        popover.style.top = `${rect.top + window.scrollY - popover.offsetHeight/2 + 10}px`;
        popover.style.left = `${rect.right - 100}px`;
    });
});

function createCollaborations() {
    let tempData = {};
    projectData.forEach(project => {
        tempData = {...profData};
        Object.keys(tempData).forEach(profName => {
            if(!tempData?.[profName]?.collaborations) {
                tempData[profName].collaborations = [];
            }

            if(project.Investigators[profName]) {
                Object.keys(project.Investigators).forEach(prof => {
                    if(prof !== profName) {
                        if(!tempData[profName].collaborations.includes(prof)) {
                            tempData[profName].collaborations.push(prof);
                        }
                    }
                })
            }
        })
    })

    return tempData;
}
