import React from 'react';
import { 
  Box, Card, Paper, Grid, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab,
  Button, Typography, TextField, Divider, Avatar, Chip, Switch, Checkbox, Slider, Badge, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type PropType = 'text' | 'number' | 'select' | 'boolean' | 'color';

export interface PropertySchema {
  name: string;
  label: string;
  type: PropType;
  options?: { value: string; label: string }[];
}

export interface ComponentConfig {
  type: string;
  label: string;
  category: 'Layout' | 'Surfaces' | 'Inputs' | 'Data Display' | 'Feedback';
  canHaveChildren: boolean;
  allowedChildren?: string[]; // If defined, ONLY these types can be dropped inside
  allowedParents?: string[];  // If defined, this component can ONLY be dropped inside these types
  defaultProps: Record<string, any>;
  mainSchema: PropertySchema[];
  advancedSchema?: PropertySchema[];
  component: React.FC<any> | string; // The actual React component to render
  renderLogic?: (props: any, children: React.ReactNode) => React.ReactNode; // Custom wrapper if needed (like Accordion or Tabs)
}

// Reusable common schema properties
const SPACING_SCHEMA: PropertySchema[] = [
  { name: 'p', label: 'Padding (p)', type: 'number' },
  { name: 'mt', label: 'Margin Top (mt)', type: 'number' },
  { name: 'mb', label: 'Margin Bottom (mb)', type: 'number' },
  { name: 'ml', label: 'Margin Left (ml)', type: 'number' },
  { name: 'mr', label: 'Margin Right (mr)', type: 'number' },
];

const VARIANT_SCHEMA = (options: string[]): PropertySchema => ({
  name: 'variant', label: 'Variant', type: 'select',
  options: options.map(o => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))
});

const COLOR_SCHEMA: PropertySchema = {
  name: 'color', label: 'Color', type: 'select',
  options: [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'inherit', label: 'Inherit' },
  ]
};

const DISPLAY_SCHEMA: PropertySchema = {
  name: 'display', label: 'Display', type: 'select',
  options: [
    { value: '', label: 'Default' },
    { value: 'block', label: 'Block' },
    { value: 'inline', label: 'Inline' },
    { value: 'inline-block', label: 'Inline-Block' },
    { value: 'flex', label: 'Flex' },
    { value: 'inline-flex', label: 'Inline-Flex' },
    { value: 'none', label: 'None' }
  ]
};

export const Registry: Record<string, ComponentConfig> = {
  // === LAYOUT ===
  Box: {
    type: 'Box', label: 'Box', category: 'Layout', canHaveChildren: true,
    component: Box,
    defaultProps: { p: 2, minHeight: 50, border: '1px solid transparent' },
    mainSchema: [DISPLAY_SCHEMA, { name: 'bgcolor', label: 'Background Color', type: 'text' }],
    advancedSchema: SPACING_SCHEMA
  },
  GridRow: {
    type: 'GridRow', label: 'Grid Row', category: 'Layout', canHaveChildren: true,
    allowedChildren: ['GridColumn'], // Strict MUI structure
    component: Grid,
    defaultProps: { container: true, spacing: 2 },
    mainSchema: [
      DISPLAY_SCHEMA,
      { name: 'spacing', label: 'Spacing (0-12)', type: 'number' },
      { name: 'direction', label: 'Direction', type: 'select', options: [
        { value: 'row', label: 'Row' }, { value: 'row-reverse', label: 'Row Reverse' },
        { value: 'column', label: 'Column' }, { value: 'column-reverse', label: 'Column Reverse' }
      ]},
      { name: 'justifyContent', label: 'Justify Content', type: 'select', options: [
        { value: 'flex-start', label: 'Flex Start' }, { value: 'center', label: 'Center' },
        { value: 'flex-end', label: 'Flex End' }, { value: 'space-between', label: 'Space Between' },
        { value: 'space-around', label: 'Space Around' }, { value: 'space-evenly', label: 'Space Evenly' }
      ]},
      { name: 'alignItems', label: 'Align Items', type: 'select', options: [
        { value: 'flex-start', label: 'Flex Start' }, { value: 'center', label: 'Center' },
        { value: 'flex-end', label: 'Flex End' }, { value: 'stretch', label: 'Stretch' },
        { value: 'baseline', label: 'Baseline' }
      ]},
      { name: 'wrap', label: 'Wrap', type: 'select', options: [
        { value: 'wrap', label: 'Wrap' }, { value: 'nowrap', label: 'Nowrap' }, { value: 'wrap-reverse', label: 'Wrap Reverse' }
      ]},
    ],
    advancedSchema: SPACING_SCHEMA
  },
  GridColumn: {
    type: 'GridColumn', label: 'Grid Column', category: 'Layout', canHaveChildren: true,
    allowedParents: ['GridRow'], // Strict MUI structure
    component: Grid,
    defaultProps: { item: true, xs: 12, md: 6 },
    mainSchema: [
      DISPLAY_SCHEMA,
      { name: 'xs', label: 'Mobile Width (xs)', type: 'number' },
      { name: 'sm', label: 'Tablet Width (sm)', type: 'number' },
      { name: 'md', label: 'Desktop Width (md)', type: 'number' },
      { name: 'lg', label: 'Large Screen (lg)', type: 'number' },
    ],
    advancedSchema: SPACING_SCHEMA
  },

  // === SURFACES ===
  Card: {
    type: 'Card', label: 'Card', category: 'Surfaces', canHaveChildren: true,
    component: Card,
    defaultProps: { p: 2, minHeight: 50 },
    mainSchema: [DISPLAY_SCHEMA],
    advancedSchema: SPACING_SCHEMA
  },
  Paper: {
    type: 'Paper', label: 'Paper', category: 'Surfaces', canHaveChildren: true,
    component: Paper,
    defaultProps: { p: 2, minHeight: 50, elevation: 1 },
    mainSchema: [DISPLAY_SCHEMA, { name: 'elevation', label: 'Elevation', type: 'number' }],
    advancedSchema: SPACING_SCHEMA
  },
  Accordion: {
    type: 'Accordion', label: 'Accordion', category: 'Surfaces', canHaveChildren: true,
    component: Accordion,
    defaultProps: { defaultExpanded: true, title: 'Accordion Title' },
    mainSchema: [
      { name: 'title', label: 'Title Text', type: 'text' },
      { name: 'defaultExpanded', label: 'Expanded by Default', type: 'boolean' }
    ],
    advancedSchema: SPACING_SCHEMA,
    renderLogic: (props: any, children: React.ReactNode) => (
      <Accordion defaultExpanded={props.defaultExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>{props.title}</AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    )
  },

  // === INPUTS ===
  Button: {
    type: 'Button', label: 'Button', category: 'Inputs', canHaveChildren: false,
    component: Button,
    defaultProps: { variant: 'contained', color: 'primary', children: 'Click Me', fullWidth: false },
    mainSchema: [
      { name: 'children', label: 'Text', type: 'text' },
      VARIANT_SCHEMA(['contained', 'outlined', 'text']),
      COLOR_SCHEMA,
      { name: 'fullWidth', label: 'Full Width', type: 'boolean' },
    ],
    advancedSchema: SPACING_SCHEMA
  },
  TextField: {
    type: 'TextField', label: 'Text Field', category: 'Inputs', canHaveChildren: false,
    component: TextField,
    defaultProps: { label: 'Label', variant: 'outlined', fullWidth: true },
    mainSchema: [
      { name: 'label', label: 'Label', type: 'text' },
      VARIANT_SCHEMA(['outlined', 'filled', 'standard']),
      { name: 'fullWidth', label: 'Full Width', type: 'boolean' },
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Switch: {
    type: 'Switch', label: 'Switch', category: 'Inputs', canHaveChildren: false,
    component: Switch,
    defaultProps: { color: 'primary', defaultChecked: false },
    mainSchema: [
      COLOR_SCHEMA,
      { name: 'defaultChecked', label: 'Checked by default', type: 'boolean' }
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Checkbox: {
    type: 'Checkbox', label: 'Checkbox', category: 'Inputs', canHaveChildren: false,
    component: Checkbox,
    defaultProps: { color: 'primary', defaultChecked: false },
    mainSchema: [
      COLOR_SCHEMA,
      { name: 'defaultChecked', label: 'Checked by default', type: 'boolean' }
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Slider: {
    type: 'Slider', label: 'Slider', category: 'Inputs', canHaveChildren: false,
    component: Slider,
    defaultProps: { color: 'primary', defaultValue: 50 },
    mainSchema: [
      COLOR_SCHEMA,
      { name: 'defaultValue', label: 'Default Value', type: 'number' }
    ],
    advancedSchema: SPACING_SCHEMA
  },

  // === DATA DISPLAY ===
  Typography: {
    type: 'Typography', label: 'Typography', category: 'Data Display', canHaveChildren: false,
    component: Typography,
    defaultProps: { variant: 'body1', children: 'Sample Text' },
    mainSchema: [
      { name: 'children', label: 'Text Content', type: 'text' },
      VARIANT_SCHEMA(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline']),
      COLOR_SCHEMA,
      { name: 'align', label: 'Alignment', type: 'select', options: [
        { value: 'inherit', label: 'Inherit' }, { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }
      ]},
      DISPLAY_SCHEMA,
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Divider: {
    type: 'Divider', label: 'Divider', category: 'Data Display', canHaveChildren: false,
    component: Divider,
    defaultProps: { sx: { my: 2 } },
    mainSchema: [],
    advancedSchema: SPACING_SCHEMA
  },
  Avatar: {
    type: 'Avatar', label: 'Avatar', category: 'Data Display', canHaveChildren: false,
    component: Avatar,
    defaultProps: { alt: 'Avatar', src: 'https://mui.com/static/images/avatar/1.jpg' },
    mainSchema: [
      { name: 'alt', label: 'Alt Text', type: 'text' },
      { name: 'src', label: 'Image URL', type: 'text' },
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Chip: {
    type: 'Chip', label: 'Chip', category: 'Data Display', canHaveChildren: false,
    component: Chip,
    defaultProps: { label: 'Chip', variant: 'filled', color: 'default' },
    mainSchema: [
      { name: 'label', label: 'Label', type: 'text' },
      VARIANT_SCHEMA(['filled', 'outlined']),
      COLOR_SCHEMA,
    ],
    advancedSchema: SPACING_SCHEMA
  },

  // === FEEDBACK ===
  Alert: {
    type: 'Alert', label: 'Alert', category: 'Feedback', canHaveChildren: false,
    component: Alert,
    defaultProps: { severity: 'success', children: 'This is an alert!' },
    mainSchema: [
      { name: 'children', label: 'Message', type: 'text' },
      { name: 'severity', label: 'Severity', type: 'select', options: [
        { value: 'success', label: 'Success' }, { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' }, { value: 'error', label: 'Error' }
      ]}
    ],
    advancedSchema: SPACING_SCHEMA
  },
  Badge: {
    type: 'Badge', label: 'Badge', category: 'Feedback', canHaveChildren: false,
    component: Badge,
    defaultProps: { badgeContent: 4, color: 'primary' },
    mainSchema: [
      { name: 'badgeContent', label: 'Content', type: 'text' },
      COLOR_SCHEMA
    ],
    advancedSchema: SPACING_SCHEMA,
    renderLogic: (props: any) => (
      <Badge {...props}>
        <Box sx={{ width: 40, height: 40, bgcolor: 'action.disabledBackground', borderRadius: 1 }} />
      </Badge>
    )
  }
};
