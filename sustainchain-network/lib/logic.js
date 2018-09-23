/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
//Transaction to apply for approve request
/**
 * Track the trade of a commodity from one trader to another
 * @param {org.sustainchain.network.SubmitRequest} submitrequest - the trade to be processed
 * @transaction
 */
async function submitRequest(submitrequest) {
    //update the asset
    var time = new Date().getTime();
    var factory = getFactory();
    var NS = 'org.sustainchain.network';
    var sustainmetrics = factory.newResource(NS, 'SustainMetrics', submitrequest.timestamp+submitrequest.requestingOrg+'sustainmetrics');
    sustainmetrics.owner = submitrequest.requestingOrg;
    sustainmetrics.energyPerRevenue = submitrequest.energyPerRevenue;
    sustainmetrics.energyMix = submitrequest.energyMix;
    console.log('sustainmetrics');

    var certificate = factory.newResource(NS, 'Certification', submitrequest.timestamp+submitrequest.requestingOrg+submitrequest.certType);
    certificate.owner = submitrequest.requestingOrg;
    certificate.certType = submitrequest.certType;
    certificate.sustainmetrics = sustainmetrics;

    var approvableRequest = factory.newResource(NS, 'ApprovableRequest', submitrequest.requestingOrg.organizationName+submitrequest.timestamp);
    approvableRequest.requestingOrg = factory.newRelationship(NS, 'Organization', submitrequest.requestingOrg);
    approvableRequest.certificate = certificate;

    return getAssetRegistry(NS+'.Certification')
        .then(function(certificationRegistry){
            return certificationRegistry.add([certificate]);
        }).then(function(){
            return getAssetRegistry(NS+'.SustainMetrics');
        }).then(function(sustainMetricsRegistry){
            return sustainMetricsRegistry.add([sustainmetrics]);
        }).then(function(){
            return getAssetRegistry(NS+'.ApprovableRequest');
        }).then(function(approvableRequestRegistry){
            return approvableRequestRegistry.add([approvableRequest]);
        });
}

//Transaction to build demo - initialize organizations and approvers
/**
 * Track the trade of a commodity from one trader to another
 * @param {org.sustainchain.network.BuildDemo} submitrequest - the trade to be processed
 * @transaction
 */
async function buildDemo() {

    var factory = getFactory();
    var NS = 'org.sustainchain.network';

    var organization = factory.newResource(NS,'Organization','Epic');
    var location = factory.newConcept(NS,'Location');
    location.city = 'Verona';
    location.state = 'Wisconsin';
    location.country = 'USA';
    organization.location = location;
    organization.sector = 'Healthcare';

    var approver = factory.newResource(NS,'Approver','LEED Expert');
    approver.yearsExperience = 10;
    approver.approverSkills = ['Energy_Assessments'];
    approver.availableCerts = ['LEED', 'EnergyStar'];

}
