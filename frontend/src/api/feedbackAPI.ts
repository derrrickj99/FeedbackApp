import type { CreateFormRequest, Feedback, FeedbackForm, IApiResponse, SubmitFeedbackRequest } from "../typings";
import { CustomError, getError } from "../utils/error";
import { apiClient } from "./api";
import { FetchAPI } from "./fetchAPI";

export const feedback = {
  getForms: async (page = 1, limit = 10, active?: boolean, accessToken?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (active !== undefined) {
        params.append('active', active.toString());
      }

      const response = await apiClient.get(`/forms`, accessToken);

      const body = await response.json() as IApiResponse<FeedbackForm[]>;

      if (!response.ok || body.data == undefined) {
        throw new CustomError('Server Error', body.message ?? "Unknown Error. Contact admin")
      }

      return body.data;

    } catch (error) {
      console.log("here")
      throw getError(error);
    }
  },

  get: async (formId: string, accessToken: string) => {
    try {
      const response = await apiClient.get(`/forms/${formId}`, accessToken);

      const body = await response.json() as IApiResponse<FeedbackForm>;

      if (!response.ok || body.data == undefined) {
        throw new CustomError('Server Error', body.message ?? "Unknown Error. Contact admin")
      }

      return body.data;

    } catch (error) {
      throw getError(error);
    }
  },

  create: async (formData: CreateFormRequest, accessToken: string) => {
    try {
      const response = await apiClient.post("/form", accessToken, {
        body: JSON.stringify(formData)
      })

      const body = await response.json() as IApiResponse<FeedbackForm>;

      if (!response.ok || body.data == undefined) {
        throw new CustomError('Server Error', body.message ?? "Unknown Error. Contact admin")
      }

      return body.data;

    } catch (error) {
      throw getError(error);
    }
  },

  update: async (formData: Partial<CreateFormRequest>, formId: string, accessToken: string,) => {
    try {
      const response = await apiClient.put(`/forms/${formId}`, accessToken, {
        body: JSON.stringify(formData)
      })

      const body = await response.json() as IApiResponse<FeedbackForm>;

      if (!response.ok || body.data == undefined) {
        throw new CustomError('Server Error', body.message ?? "Unknown Error. Contact admin")
      }

      return body.data;

    } catch (error) {
      throw getError(error);
    }
  },

  deactivate: async (formId: string, accessToken: string) => {
    try {
      const response = await apiClient.delete(`/forms/${formId}`, accessToken)

      const body = await response.json() as IApiResponse<undefined>;

      if (!response.ok) {
        throw new CustomError('Server Error', body.message ?? "Unknown Error. Contact admin")
      }
    } catch (error) {
      throw getError(error);
    }
  }
}









// API Client Class
class FeedbackAPI extends FetchAPI {
  // Form API Methods
  // async getForms(page = 1, limit = 10, active?: boolean, token: string = ""): Promise<IApiResponse<FeedbackForm[]>> {
  //   const params = new URLSearchParams({
  //     page: page.toString(),
  //     limit: limit.toString(),
  //   });

  //   if (active !== undefined) {
  //     params.append('active', active.toString());
  //   }

  //   const options: RequestInit = {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   }
  //   //return this.fetchAPI<FeedbackForm[]>(`/forms?${params}`);
  //   return this.fetchAPI<FeedbackForm[]>(`/forms`, options);
  // }

  // async getForm(id: string): Promise<IApiResponse<FeedbackForm>> {
  //   return this.fetchAPI<FeedbackForm>(`/forms/${id}`);
  // }

  // async createForm(formData: CreateFormRequest): Promise<IApiResponse<FeedbackForm>> {
  //   return this.fetchAPI<FeedbackForm>('/forms', {
  //     method: 'POST',
  //     body: JSON.stringify(formData),
  //   });
  // }

  // async updateForm(
  //   id: string,
  //   formData: Partial<CreateFormRequest & { isActive: boolean }>
  // ): Promise<IApiResponse<FeedbackForm>> {
  //   return this.fetchAPI<FeedbackForm>(`/forms/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(formData),
  //   });
  // }

  // async deleteForm(id: string): Promise<IApiResponse<void>> {
  //   console.log(id);
  //   return this.fetchAPI<void>(`/forms/${id}`, {
  //     method: 'DELETE',
  //   });
  // }

  // async getFormStats(id: string): Promise<IApiResponse<any>> {
  //   return this.fetchAPI<any>(`/forms/${id}/stats`);
  // }

  // Feedback API Methods
  async getFeedback(formId?: string, page = 1, limit = 10): Promise<IApiResponse<Feedback[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (formId) {
      params.append('formId', formId);
    }

    return this.fetchAPI<Feedback[]>(`/feedback?${params}`);
  }

  async getFeedbackById(id: string): Promise<IApiResponse<Feedback>> {
    return this.fetchAPI<Feedback>(`/feedback/${id}`);
  }

  async submitFeedback(feedbackData: SubmitFeedbackRequest): Promise<IApiResponse<Feedback>> {
    return this.fetchAPI<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteFeedback(id: string): Promise<IApiResponse<void>> {
    return this.fetchAPI<void>(`/feedback/${id}`, {
      method: 'DELETE',
    });
  }

  async exportFeedback(formId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.getBaseURL}/feedback/form/${formId}/export`);

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Export Error:', error);
      throw error;
    }
  }

  // Utility method to download exported CSV
  async downloadFeedbackCSV(formId: string, filename?: string): Promise<void> {
    try {
      const blob = await this.exportFeedback(formId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `feedback-export-${formId}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  }

  // Health check
  // async healthCheck(): Promise<any> {
  //   return this.fetchAPI<any>('/health');
  // }
}

// Create and export API instance
export const feedbackAPI = new FeedbackAPI();

// Example usage in components:
/*
import { feedbackAPI, useFeedbackAPI } from './api';

const MyComponent = () => {
  const { loading, error, executeAPI } = useFeedbackAPI();
  
  const handleCreateForm = async (formData) => {
    try {
      const result = await executeAPI(() => feedbackAPI.createForm(formData));
      console.log('Form created:', result.data);
    } catch (err) {
      console.error('Failed to create form:', error);
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      // Your component JSX //
    </div>
  );
};
*/