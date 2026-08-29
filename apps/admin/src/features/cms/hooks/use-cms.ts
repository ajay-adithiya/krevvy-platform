import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/cms.service";

// --- Singletons ---

// Global Content
export function useGlobalContent() {
  return useQuery({
    queryKey: ["cms", "global"],
    queryFn: api.getGlobalContent,
  });
}
export function useUpdateGlobalContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertGlobalContent,
    onSuccess: () => {
      toast.success("Global content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "global"] });
    },
    onError: (error) => {
      toast.error("Failed to update global content");
      console.error(error);
    }
  });
}

// Home Content
export function useHomeContent() {
  return useQuery({
    queryKey: ["cms", "home"],
    queryFn: api.getHomeContent,
  });
}
export function useUpdateHomeContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertHomeContent,
    onSuccess: () => {
      toast.success("Home content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "home"] });
    },
    onError: (error) => toast.error("Failed to update home content")
  });
}

// Products Content
export function useProductsContent() {
  return useQuery({
    queryKey: ["cms", "products"],
    queryFn: api.getProductsContent,
  });
}
export function useUpdateProductsContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertProductsContent,
    onSuccess: () => {
      toast.success("Products page content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "products"] });
    },
    onError: (error) => toast.error("Failed to update products content")
  });
}

// About Content
export function useAboutContent() {
  return useQuery({
    queryKey: ["cms", "about"],
    queryFn: api.getAboutContent,
  });
}
export function useUpdateAboutContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertAboutContent,
    onSuccess: () => {
      toast.success("About page content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "about"] });
    },
    onError: (error) => toast.error("Failed to update about content")
  });
}

// Contact Content
export function useContactContent() {
  return useQuery({
    queryKey: ["cms", "contact"],
    queryFn: api.getContactContent,
  });
}
export function useUpdateContactContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertContactContent,
    onSuccess: () => {
      toast.success("Contact page content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "contact"] });
    },
    onError: (error) => toast.error("Failed to update contact content")
  });
}

// FAQ Content
export function useFaqContent() {
  return useQuery({
    queryKey: ["cms", "faq"],
    queryFn: api.getFaqContent,
  });
}
export function useUpdateFaqContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertFaqContent,
    onSuccess: () => {
      toast.success("FAQ page content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cms", "faq"] });
    },
    onError: (error) => toast.error("Failed to update FAQ content")
  });
}

// --- Repeatables ---

// Navigation
export function useNavigations() {
  return useQuery({ queryKey: ["cms", "navigation"], queryFn: api.getNavigations });
}
export function useCreateNavigation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createNavigation,
    onSuccess: () => { toast.success("Navigation item created"); queryClient.invalidateQueries({ queryKey: ["cms", "navigation"] }); },
  });
}
export function useUpdateNavigation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateNavigation,
    onSuccess: () => { toast.success("Navigation item updated"); queryClient.invalidateQueries({ queryKey: ["cms", "navigation"] }); },
  });
}
export function useDeleteNavigation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteNavigation,
    onSuccess: () => { toast.success("Navigation item deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "navigation"] }); },
  });
}

// Footer Groups
export function useFooterGroups() {
  return useQuery({ queryKey: ["cms", "footerGroups"], queryFn: api.getFooterGroups });
}
export function useCreateFooterGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFooterGroup,
    onSuccess: () => { toast.success("Footer group created"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}
export function useUpdateFooterGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateFooterGroup,
    onSuccess: () => { toast.success("Footer group updated"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}
export function useDeleteFooterGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFooterGroup,
    onSuccess: () => { toast.success("Footer group deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}

// Footer Links
export function useCreateFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFooterLink,
    onSuccess: () => { toast.success("Footer link created"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}
export function useUpdateFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateFooterLink,
    onSuccess: () => { toast.success("Footer link updated"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}
export function useDeleteFooterLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFooterLink,
    onSuccess: () => { toast.success("Footer link deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "footerGroups"] }); },
  });
}

// FAQ Categories
export function useFaqCategories() {
  return useQuery({ queryKey: ["cms", "faqCategories"], queryFn: api.getFaqCategories });
}
export function useCreateFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFaqCategory,
    onSuccess: () => { toast.success("FAQ category created"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}
export function useUpdateFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateFaqCategory,
    onSuccess: () => { toast.success("FAQ category updated"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}
export function useDeleteFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFaqCategory,
    onSuccess: () => { toast.success("FAQ category deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}

// FAQ Items
export function useCreateFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFaqItem,
    onSuccess: () => { toast.success("FAQ item created"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}
export function useUpdateFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateFaqItem,
    onSuccess: () => { toast.success("FAQ item updated"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}
export function useDeleteFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFaqItem,
    onSuccess: () => { toast.success("FAQ item deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "faqCategories"] }); },
  });
}

// About Pillars
export function useCreateAboutPillar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAboutPillar,
    onSuccess: () => { toast.success("Pillar created"); queryClient.invalidateQueries({ queryKey: ["cms", "about"] }); },
  });
}
export function useUpdateAboutPillar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateAboutPillar,
    onSuccess: () => { toast.success("Pillar updated"); queryClient.invalidateQueries({ queryKey: ["cms", "about"] }); },
  });
}
export function useDeleteAboutPillar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAboutPillar,
    onSuccess: () => { toast.success("Pillar deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "about"] }); },
  });
}

// Media Assets
export function useMediaAssets() {
  return useQuery({ queryKey: ["cms", "media"], queryFn: api.getMediaAssets });
}
export function useCreateMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createMediaAsset,
    onSuccess: () => { toast.success("Media uploaded"); queryClient.invalidateQueries({ queryKey: ["cms", "media"] }); },
  });
}
export function useUpdateMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateMediaAsset,
    onSuccess: () => { toast.success("Media updated"); queryClient.invalidateQueries({ queryKey: ["cms", "media"] }); },
  });
}
export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteMediaAsset,
    onSuccess: () => { toast.success("Media deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "media"] }); },
  });
}

// Contact Inquiry Options
export function useCreateContactInquiryOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createContactInquiryOption,
    onSuccess: () => { toast.success("Inquiry option created"); queryClient.invalidateQueries({ queryKey: ["cms", "contact"] }); },
  });
}
export function useUpdateContactInquiryOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateContactInquiryOption,
    onSuccess: () => { toast.success("Inquiry option updated"); queryClient.invalidateQueries({ queryKey: ["cms", "contact"] }); },
  });
}
export function useDeleteContactInquiryOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteContactInquiryOption,
    onSuccess: () => { toast.success("Inquiry option deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "contact"] }); },
  });
}

// Amazon Modal Benefits
export function useCreateAmazonModalBenefit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAmazonModalBenefit,
    onSuccess: () => { toast.success("Amazon benefit created"); queryClient.invalidateQueries({ queryKey: ["cms", "global"] }); },
  });
}
export function useUpdateAmazonModalBenefit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateAmazonModalBenefit,
    onSuccess: () => { toast.success("Amazon benefit updated"); queryClient.invalidateQueries({ queryKey: ["cms", "global"] }); },
  });
}
export function useDeleteAmazonModalBenefit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAmazonModalBenefit,
    onSuccess: () => { toast.success("Amazon benefit deleted"); queryClient.invalidateQueries({ queryKey: ["cms", "global"] }); },
  });
}
