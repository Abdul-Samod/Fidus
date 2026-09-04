import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
    
    it('renders the children text correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders a loading spinner when loading is true and disables the button', () => {
        render(<Button loading={true}>Submit</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // The text 'Submit' should be hidden/replaced by the loader, or the loader SVG should be present
        expect(document.querySelector('svg')).toBeInTheDocument();
    });

});
