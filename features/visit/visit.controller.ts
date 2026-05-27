import { Request, Response } from 'express';
import { createVisit, getVisits, updateVisitStatus, closeGatePass, getSecurityGuardContact } from './visit.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import { sendWhatsAppTemplate } from '../../utils/whatsapp.service';

export const submitVisitRequest = async (req: Request, res: Response) => {
  try {
    const visit = await createVisit(req.body);
    const approvalLink = 'https://gate-pass-frontend-theta.vercel.app/approval-request';

    // Notify the host (person to meet) using 'gate_pass_requests' template
    if (visit.personToMeetContact) {
      const serialNumber = (visit as any).serialNo || `SN-${visit.id.toString().padStart(3, '0')}`;
      const timeStr = visit.timeOfEntry ? new Date(visit.timeOfEntry).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const imageLink = visit.visitorPhoto && visit.visitorPhoto.startsWith('http') 
        ? visit.visitorPhoto 
        : 'https://img.freepik.com/free-vector/jewelry-logo-design_126523-2892.jpg';

      sendWhatsAppTemplate(
        visit.personToMeetContact,
        'gate_pass_requests',
        [
          {
            type: 'HEADER',
            parameters: [
              {
                type: 'IMAGE',
                image: { link: imageLink }
              }
            ]
          },
          {
            type: 'BODY',
            parameters: [
              { type: 'TEXT', text: String(serialNumber) },
              { type: 'TEXT', text: String(visit.visitorName || 'N/A') },
              { type: 'TEXT', text: String(visit.personToMeet || 'N/A') },
              { type: 'TEXT', text: String(visit.purposeOfVisit || 'N/A') },
              { type: 'TEXT', text: timeStr },
              { type: 'TEXT', text: approvalLink } // Dynamic Approval Link
            ]
          }
        ]
      );
    }

    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.VISIT_CREATED,
      data: visit
    });
  } catch (error) {
    console.error('Create visit error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
export const fetchAllVisits = async (req: Request, res: Response) => {
  try {
    const personToMeetParam = req.query.personToMeet;
    const personToMeet = Array.isArray(personToMeetParam) 
      ? personToMeetParam[0] as string 
      : personToMeetParam as string;
      
    const gatePassClosed = req.query.gatePassClosed !== undefined ? req.query.gatePassClosed === 'true' : undefined;

    const visits = await getVisits({ personToMeet, gatePassClosed });
    
    return res.status(200).json({
      success: true,
      data: visits
    });
  } catch (error) {
    console.error('Fetch visits error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const approveVisitStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status, approvedBy } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid visit ID' });
    }

    const updated = await updateVisitStatus(id, status, approvedBy);
    const visitorUpdateLink = process.env.FRONTEND_URL || 'https://gate-pass-frontend-theta.vercel.app';
    const guardCloseGatePassLink = 'https://gate-pass-frontend-theta.vercel.app/close-gate-pass';
    
    // Notify the visitor about the status update using 'gate_pass_updated' template
    if (updated && updated.mobileNumber) {
      const serialNumber = (updated as any).serialNo || `SN-${updated.id.toString().padStart(3, '0')}`;
      const timeStr = updated.timeOfEntry ? new Date(updated.timeOfEntry).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // e.g. "Approved"

      sendWhatsAppTemplate(
        updated.mobileNumber,
        'gate_pass_updated',
        [
          {
            type: 'BODY',
            parameters: [
              { type: 'TEXT', text: String(serialNumber) },
              { type: 'TEXT', text: String(updated.visitorName || 'N/A') },
              { type: 'TEXT', text: String(updated.personToMeet || 'N/A') },
              { type: 'TEXT', text: String(updated.purposeOfVisit || 'N/A') },
              { type: 'TEXT', text: timeStr },
              { type: 'TEXT', text: displayStatus }
            ]
          }
        ]
      );
    }

    // Notify the Security Guard if the visit is approved
    if (updated && status.toLowerCase() === 'approved') {
      const guardContact = await getSecurityGuardContact() || process.env.SECURITY_GUARD_PHONE;
      if (guardContact) {
        sendWhatsAppTemplate(
          guardContact,
          'gate_pass_updated',
          [
            {
              type: 'BODY',
              parameters: [
                { type: 'TEXT', text: String((updated as any).serialNo || `SN-${updated.id.toString().padStart(3, '0')}`) },
                { type: 'TEXT', text: String(updated.visitorName || 'N/A') },
                { type: 'TEXT', text: String(updated.personToMeet || 'N/A') },
                { type: 'TEXT', text: String(updated.purposeOfVisit || 'N/A') },
                { type: 'TEXT', text: updated.timeOfEntry ? new Date(updated.timeOfEntry).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
                { type: 'TEXT', text: 'Approved' }
              ]
            }
          ]
        ).catch(err => console.error('Failed to notify security guard:', err));
      }
    }

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.VISIT_APPROVED,
      data: updated
    });
  } catch (error) {
    console.error('Approve visit error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const closeVisitGatePass = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid visit ID' });
    }

    const updated = await closeGatePass(id);
    
    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.VISIT_CLOSED,
      data: updated
    });
  } catch (error) {
    console.error('Close gate pass error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
