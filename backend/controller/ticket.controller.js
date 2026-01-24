import { asynchandler } from "../utils/AsyncHandler.js";
import { findBestFAQMatch } from "../services/faq.service.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/Apierror.js";

const searchFAQ = asynchandler(async (req, res) => {
  const { subject, body } = req.body;
  
  if (!subject) {
    throw new ApiError(400, "Subject is required to perform a search");
  }

  // Combine text for better context
  const queryText = `${subject} ${body || ""}`.trim();

  // Call the service
  const searchResult = await findBestFAQMatch(queryText);

  // Return standardized response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        searchResult, 
        "FAQ search completed successfully"
      )
    );
});

export { searchFAQ };