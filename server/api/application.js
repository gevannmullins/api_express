'use strict';

import _ from 'lodash';
import express from 'express';
import { Model } from 'backbone';
import BackboneValidation from 'backbone.validation';
import getValidationRules from '../../universal/validation/application-form';
import contentfulClient from '../../config/contentful-management-client';
import { getApplicationClientData, getApplicationAdminData } from '../email-data';
import { sendEmail } from '../utils/email';
const router = express.Router();

/*
 * Submit an application form and log it with Contentful
 * @example: POST: /api/application
 */
router.post('/', (req, res) => {
  const formFields = req.body;
  if (!formFields) {
    return res.status(400).json({ msg: 'Make sure to post through form data.' });
  }

  // Validate form data
  const ContactModel = Model.extend(
    _.extend({ validation: getValidationRules() }, BackboneValidation.mixin)
  );
  const model = new ContactModel(formFields);
  const errors = model.validate();
  if (!model.isValid()) {
    return res.status(200).json({ errors });
  }
  
  const fields = _.reduce(formFields, (result, value, key) => {
    result[key] = {
      'en-ZA': value
    };
    return result;
  }, { applicationId: { 'en-ZA': `af-${_.now()}` } });
  
  // Write to Contentful
  contentfulClient.getSpace(process.env.CONTENTFUL_SPACE || 'jmk8tiusj36w')
    .then((space) => {
      space
        .createEntry('applicationEntry', { fields })
        .then((response) => {
          // Send email to client
          sendEmail(res, getApplicationClientData(formFields), () => {
            // Send email to iBuild administrator
            sendEmail(res, getApplicationAdminData(formFields), () => res.status(200).json({ msg: 'Application successfully submitted.' }));
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
