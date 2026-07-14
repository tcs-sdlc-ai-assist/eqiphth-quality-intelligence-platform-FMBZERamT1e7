import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Card container component with design system spacing and border tokens.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Card content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Card = forwardRef(function Card({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-card border border-slate-200 transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Card header section with consistent padding.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Header content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const CardHeader = forwardRef(function CardHeader({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Card title element rendered as an h3.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Title content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const CardTitle = forwardRef(function CardTitle({ className, children, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Card description element rendered as a paragraph.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Description content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const CardDescription = forwardRef(function CardDescription({ className, children, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-slate-500', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Card content section with horizontal and bottom padding.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const CardContent = forwardRef(function CardContent({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Card footer section with top border and consistent padding.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Footer content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const CardFooter = forwardRef(function CardFooter({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;