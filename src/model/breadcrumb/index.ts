/**
 * Serializable breadcrumb trail segments for dashboard header (Redux-safe).
 */
export type BreadcrumbSegmentStaticLink = {
  kind: 'staticLink';
  label: string;
  href?: string;
};

export type BreadcrumbSegmentPlainText = {
  kind: 'plainText';
  label: string;
};

export type BreadcrumbSegment = BreadcrumbSegmentStaticLink | BreadcrumbSegmentPlainText;

export type BreadcrumbTrailBase = {
  label: string;
  href?: string;
};
